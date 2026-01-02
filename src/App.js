// cd C:\Users\natel\Documents\react-projects\tic-tac-toe

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

const EMOJI_OPTIONS = ['❌', '⭕', '🔥', '⭐', '💎'];

// Function to play a click sound
function playClickSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Higher pitch for a pleasant click
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // Silently fail if audio context is not available
    console.log('Audio not available');
  }
}

function Square({ value, onSquareClick, disabled }) {
  return (
    <button className={`square ${disabled ? 'disabled' : ''}`} onClick={onSquareClick} disabled={disabled}>
      <span className="square-content">{value}</span>
    </button>
  );
}

function Board({ squares, xIsNext, onPlay, xEmoji, oEmoji, isAITurn }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares) || isAITurn) return;

    // Play click sound when a valid move is made
    playClickSound();

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? xEmoji : oEmoji;
    onPlay(nextSquares);
  }

  return (
    <div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} disabled={isAITurn} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} disabled={isAITurn} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} disabled={isAITurn} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} disabled={isAITurn} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} disabled={isAITurn} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} disabled={isAITurn} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} disabled={isAITurn} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} disabled={isAITurn} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} disabled={isAITurn} />
      </div>
    </div>
  );
}

function InitialWelcomePage({ onSelectPlayers }) {
  return (
    <div className="welcome-page">
      <h1 className="welcome-title">Welcome to Tic-Tac-Toe!</h1>
      <div className="welcome-content">
        <div className="player-mode-selection">
          <button
            className="mode-btn"
            onClick={() => onSelectPlayers(1)}
          >
            <span className="mode-icon">👤</span>
            <span className="mode-text">1 Player</span>
            <span className="mode-desc">Play against AI</span>
          </button>
          <button
            className="mode-btn"
            onClick={() => onSelectPlayers(2)}
          >
            <span className="mode-icon">👥</span>
            <span className="mode-text">2 Players</span>
            <span className="mode-desc">Play with a friend</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerSetupPage({ numPlayers, onStartGame, onBack }) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Emoji, setPlayer1Emoji] = useState('❌');
  const [player2Emoji, setPlayer2Emoji] = useState('⭕');

  const handleStart = () => {
    if (numPlayers === 1) {
      if (player1Name.trim()) {
        onStartGame({
          player1: { name: player1Name.trim(), emoji: player1Emoji },
          player2: { name: 'AI', emoji: player2Emoji },
          isSinglePlayer: true
        });
      }
    } else {
      if (player1Name.trim() && player2Name.trim()) {
        onStartGame({
          player1: { name: player1Name.trim(), emoji: player1Emoji },
          player2: { name: player2Name.trim(), emoji: player2Emoji },
          isSinglePlayer: false
        });
      }
    }
  };

  return (
    <div className="welcome-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="welcome-title">Player Setup</h1>
      <div className="welcome-content">
        <div className="player-setup">
          <div className="player-section">
            <h2>Player 1</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="name-input"
              maxLength={20}
            />
            <div className="emoji-selection">
              <label>Choose your emoji:</label>
              <div className="emoji-buttons">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={`p1-${emoji}`}
                    className={`emoji-btn ${player1Emoji === emoji ? 'selected' : ''}`}
                    onClick={() => setPlayer1Emoji(emoji)}
                    disabled={player2Emoji === emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {numPlayers === 2 && (
            <div className="player-section">
              <h2>Player 2</h2>
              <input
                type="text"
                placeholder="Enter your name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="name-input"
                maxLength={20}
              />
              <div className="emoji-selection">
                <label>Choose your emoji:</label>
                <div className="emoji-buttons">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={`p2-${emoji}`}
                      className={`emoji-btn ${player2Emoji === emoji ? 'selected' : ''}`}
                      onClick={() => setPlayer2Emoji(emoji)}
                      disabled={player1Emoji === emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {numPlayers === 1 && (
            <div className="player-section">
              <h2>AI Opponent</h2>
              <div className="ai-info">
                <p>AI will use: {player2Emoji}</p>
              </div>
              <div className="emoji-selection">
                <label>Choose AI emoji:</label>
                <div className="emoji-buttons">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={`ai-${emoji}`}
                      className={`emoji-btn ${player2Emoji === emoji ? 'selected' : ''}`}
                      onClick={() => setPlayer2Emoji(emoji)}
                      disabled={player1Emoji === emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          className="start-btn"
          onClick={handleStart}
          disabled={!player1Name.trim() || (numPlayers === 2 && !player2Name.trim())}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

function GamePage({ player1, player2, isSinglePlayer, onBackToWelcome }) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const xEmoji = player1.emoji;
  const oEmoji = player2.emoji;

  // ← Must be declared here
  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(square => square !== null);
  const isTie = !winner && isBoardFull;

  const resetGame = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }, []);

  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [currentMove, history]);

  // AI move logic
  const makeAIMove = useCallback((squares) => {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testSquares = squares.slice();
        testSquares[i] = oEmoji;
        if (calculateWinner(testSquares) === oEmoji) {
          return i;
        }
      }
    }

    // Check if need to block player
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testSquares = squares.slice();
        testSquares[i] = xEmoji;
        if (calculateWinner(testSquares) === xEmoji) {
          return i;
        }
      }
    }

    // Try center
    if (!squares[4]) return 4;

    // Try corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Try any available square
    const available = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return null;
  }, [xEmoji, oEmoji]);

  // Trigger confetti when a winner is detected
  useEffect(() => {
    if (winner) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [winner]);

  // Auto-reset after 3 seconds if it's a tie
  useEffect(() => {
    if (isTie) {
      const timeout = setTimeout(() => {
        resetGame();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isTie, resetGame]);

  // Handle AI moves
  useEffect(() => {
    if (isSinglePlayer && !xIsNext && !winner && !isTie) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(currentSquares);
        if (aiMove !== null) {
          const nextSquares = currentSquares.slice();
          nextSquares[aiMove] = oEmoji;
          handlePlay(nextSquares);
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isSinglePlayer, xIsNext, winner, isTie, currentSquares, makeAIMove, oEmoji, handlePlay]);


  // Determine winner name
  const winnerName = winner 
    ? (winner === xEmoji ? player1.name : player2.name)
    : null;

  const status = winner
    ? <span className="winner">Winner: {winnerName} {winner}</span>
    : isTie
    ? <span className="tie">It's a draw! Resetting in 3 seconds...</span>
    : isSinglePlayer && !xIsNext
    ? <span className="next-player">AI is thinking...</span>
    : <span className="next-player">Next player: {xIsNext ? `${player1.name} ${xEmoji}` : `${player2.name} ${oEmoji}`}</span>;

  return (
    <div className="game">
      <button className="back-btn" onClick={onBackToWelcome}>← Back to Welcome</button>
      <div className="players-header">
        <div className="players-names">
          <div className="player-name-section">
            <span className="player-name">{player1.name}</span>
          </div>
          <div className="vs">VS</div>
          <div className="player-name-section">
            <span className="player-name">{player2.name}</span>
          </div>
        </div>
        <div className="players-emojis">
          <div className="player-emoji-section">
            <span className="player-emoji">{player1.emoji}</span>
          </div>
          <div className="emoji-spacer"></div>
          <div className="player-emoji-section">
            <span className="player-emoji">{player2.emoji}</span>
          </div>
        </div>
      </div>
      <button className="reset-btn" onClick={resetGame}>Reset Game</button>
      <div className="status">{status}</div>
      <div className="game-board">
        <Board 
          squares={currentSquares} 
          xIsNext={xIsNext} 
          onPlay={handlePlay} 
          xEmoji={xEmoji} 
          oEmoji={oEmoji}
          isAITurn={isSinglePlayer && !xIsNext}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('initial');
  const [numPlayers, setNumPlayers] = useState(null);
  const [gameData, setGameData] = useState(null);

  const handleSelectPlayers = (num) => {
    setNumPlayers(num);
    setCurrentPage('setup');
  };

  const handleStartGame = (data) => {
    setGameData(data);
    setCurrentPage('game');
  };

  const handleBackToInitial = () => {
    setCurrentPage('initial');
    setNumPlayers(null);
    setGameData(null);
  };

  const handleBackToSetup = () => {
    setCurrentPage('setup');
  };

  return (
    <>
      {currentPage === 'initial' ? (
        <InitialWelcomePage onSelectPlayers={handleSelectPlayers} />
      ) : currentPage === 'setup' ? (
        <PlayerSetupPage 
          numPlayers={numPlayers} 
          onStartGame={handleStartGame}
          onBack={handleBackToInitial}
        />
      ) : (
        <GamePage 
          player1={gameData.player1} 
          player2={gameData.player2}
          isSinglePlayer={gameData.isSinglePlayer}
          onBackToWelcome={handleBackToInitial}
        />
      )}
    </>
  );
}

// Helper function to check winner
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
