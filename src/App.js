import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return; // 如果已经有赢家或该位置已经有棋子，返回
    }
    const nextSquares = squares.slice(); // 创建副本
    nextSquares[i] = xIsNext ? "X" : "O"; // 根据当前玩家放置棋子
    onPlay(nextSquares); // 更新棋盘状态
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const size = 15; // 15x15的棋盘

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: size }).map((_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: size }).map((_, col) => {
            const index = row * size + col; // 计算当前位置的索引
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const size = 15;
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // 当前玩家是否为 'X'
  const currentSquares = history[currentMove]; // 当前棋盘状态

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // 设置当前回合
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const size = 15;
  const directions = [
    { x: 1, y: 0 }, // 横向
    { x: 0, y: 1 }, // 纵向
    { x: 1, y: 1 }, // 斜向（右下）
    { x: 1, y: -1 }, // 斜向（右上）
  ];

  for (let i = 0; i < squares.length; i++) {
    const player = squares[i];
    if (!player) continue; // 如果当前位置没有棋子，则跳过

    for (let { x, y } of directions) {
      let count = 1; // 当前棋子数
      for (let step = 1; step < 5; step++) {
        const newX = (i % size) + x * step;
        const newY = Math.floor(i / size) + y * step;
        if (
          newX >= 0 &&
          newX < size &&
          newY >= 0 &&
          newY < size &&
          squares[newY * size + newX] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      if (count === 5) {
        return player; // 返回胜利方
      }
    }
  }

  return null;
}
