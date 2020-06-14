import React, { useState, useEffect } from "react";
import gameHelper from "../util/gameHelper";
import Cell from "../components/Cell";

export default function Game(props) {
  const [gameField, setGameField] = useState(gameHelper.generateBoard());
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState({});
  const [gameRunning, setGameRunning] = useState(true);

  useEffect(() => {
    setScore(gameHelper.pieceCount(gameField));

    const gameStatus = gameHelper.checkGameStatus(turn, gameField);
    if (gameStatus.gameRunning && !gameStatus.movePossible) {
      // Check if there's a possible move for the other player
      let gameEndCheck = gameHelper.checkGameStatus(
        turn === 0 ? 1 : 0,
        gameField
      );
      if (!gameEndCheck.movePossible) {
        // Game Over
        setGameRunning(false);
      } else {
        // Skip turn
        setTurn(turn === 0 ? 1 : 0);
      }
    }
    setGameRunning(gameStatus.gameRunning);
  }, [gameField, turn]);

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
  };

  const newGame = () => {
    setGameField(gameHelper.generateBoard());
    setTurn(1);
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
      <div className="game-over-text">
        <span>
          {gameRunning
            ? " "
            : "Game Over. The Winner is  " +
              (score.white > score.black ? "White" : "Black")}
        </span>
      </div>
      <div>
        <button className="button-reset" onClick={newGame}>
          Reset Game
        </button>
      </div>
    </section>
  );
}
