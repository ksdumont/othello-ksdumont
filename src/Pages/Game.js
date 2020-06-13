import React, { useState, useEffect } from "react";
import gameHelper from "../util/sGameHelper";
import Cell from "../components/Cell";

export default function Game(props) {
  const [gameField, setGameField] = useState(gameHelper.generateBoard());
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState({});
  const [gameRunning, setGameRunning] = useState(true);

  useEffect(() => {
    setScore(gameHelper.pieceCount(gameField));
  }, []);

  const makeMove = (row, cell) => {
    // Check if move is valid
    setGameField(gameHelper.evaluateMove(row, cell, gameField, turn));

    // Set New Score and Turn
    const newScore = gameHelper.pieceCount(gameField);
    let blackOrWhite = turn === 0 ? "white" : "black";
    if (score[blackOrWhite] !== newScore[blackOrWhite]) {
      setTurn(turn === 1 ? 0 : 1);
    }
    setScore(newScore);
    setGameRunning(gameHelper.checkGameStatus());
  };

  const newGame = () => {
    setGameField(gameHelper.generateBoard());
    setTurn(1);
    setScore(gameHelper.pieceCount(gameField));
  };

  return (
    <section>
      <h1 className="heading">Othello</h1>

      <section className="sub-heading">
        <div className="score">
          <div className="circle black">{score.black}</div>
          <div className="circle white">{score.white}</div>
        </div>
        <br />
        <div className={"turn turn-" + (turn === 1 ? "black" : "white")}>
          {turn === 1 ? "Black" : "White"}'s turn
        </div>
      </section>

      <section className="game-container">
        {gameField.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <Cell row={i} cell={j} onMove={makeMove} key={j} color={cell} />
            ))}
          </div>
        ))}
      </section>
      <div>The game is {gameRunning ? "on" : "done"}</div>
      <div>
        <button onClick={newGame}>New Game</button>
      </div>
    </section>
  );
}
