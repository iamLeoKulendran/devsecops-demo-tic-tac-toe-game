import React, { useState, useEffect } from 'react';
import { RefreshCw, Award, Moon, Sun, Trash2 } from 'lucide-react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameHistory from './components/GameHistory';
import { calculateWinner, checkDraw } from './utils/gameLogic';

function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<Array<{
    winner: string | null;
    board: Array<string | null>;
    date: Date;
  }>>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check for winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    
    if (result) {
      setGameStatus('won');
      setWinningLine(result.line);
      
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner as keyof typeof prevScores] + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: result.winner, board: [...board], date: new Date() }
      ]);
    } else if (checkDraw(board)) {
      setGameStatus('draw');
      
      // Update draw count
      setScores(prevScores => ({
        ...prevScores,
        draws: prevScores.draws + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: null, board: [...board], date: new Date() }
      ]);
    }
  }, [board]);

  // Handle square click
  const handleClick = (index: number) => {
    // Return if square is filled or game is over
    if (board[index] || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('playing');
    setWinningLine(null);
  };

  // Reset all stats
  const resetStats = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameHistory([]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get current game status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      const winner = !xIsNext ? 'X' : 'O';
      return `Player ${winner} wins!`;
    } else if (gameStatus === 'draw') {
      return "It's a draw!";
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  const getStatusEmoji = () => {
    if (gameStatus === 'won') {
      return "🏆";
    } else if (gameStatus === 'draw') {
      return "🤝";
    } else {
      return xIsNext ? "❌" : "⭕";
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-100 to-violet-100'
    } flex flex-col items-center justify-center p-4`}>
      <div className={`max-w-4xl w-full rounded-xl shadow-2xl overflow-hidden transition-all ${
        darkMode 
          ? 'bg-gray-800 shadow-blue-500/20' 
          : 'bg-white shadow-violet-500/20'
      }`}>
        {/* Header */}
        <div className={`p-6 ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-600 to-violet-600' 
            : 'bg-gradient-to-r from-blue-500 to-violet-500'
        } text-white text-center relative`}>
          <button 
            onClick={toggleDarkMode} 
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-all"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Award className="h-8 w-8" />
            Tic Tac Toe
          </h1>
          <p className="text-blue-100 mt-1">A classic game reimagined</p>
        </div>
        
        {/* Main content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Game section */}
          <div className="md:col-span-2 flex flex-col items-center">
            {/* Game status */}
            <div className={`mb-6 text-center p-3 rounded-lg ${
              gameStatus === 'won' 
                ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                : gameStatus === 'draw'
                ? darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800'
                : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
            } transition-all duration-300 w-full max-w-md`}>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{getStatusEmoji()}</span>
                <h2 className="text-xl font-semibold">{getStatusMessage()}</h2>
              </div>
            </div>
            
            {/* Game board */}
            <Board 
              squares={board} 
              onClick={handleClick} 
              winningLine={winningLine}
              darkMode={darkMode}
            />
            
            {/* Game controls */}
            <div className="mt-8 flex gap-4 flex-wrap justify-center">
              <button 
                onClick={resetGame}
                className={`flex items-center gap-2 py-2 px-6 rounded-lg transition-all transform hover:scale-105 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-700/30'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                New Game
              </button>
              <button 
                onClick={resetStats}
                className={`flex items-center gap-2 py-2 px-6 rounded-lg transition-all transform hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-lg shadow-gray-900/30'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Reset All
              </button>
            </div>
          </div>
          
          {/* Stats section */}
          <div className={`flex flex-col gap-6 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <ScoreBoard scores={scores} darkMode={darkMode} />
            <GameHistory history={gameHistory} darkMode={darkMode} />
          </div>
        </div>
      </div>
      
      <p className={`mt-6 text-center text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Built with React · Tailwind CSS · TypeScript
      </p>
    </div>
  );
}

export default App;