import React, { useState, useEffect } from "react";
import gameHelper from "../util/gameHelper";
import Cell from "../components/Cell";

export default function Game(props) {
  const [gameField, setGameField] = useState(gameHelper.generateBoard());
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState({});
  useEffect(() => {
    setScore(gameHelper.pieceCount(gameField));
  }, []);
  const makeMove = (row, cell) => {
    // valid?
    setGameField(gameHelper.evaluateMove(row, cell, gameField, turn));
    const newScore = gameHelper.pieceCount(gameField);
    let blackOrWhite = turn === 0 ? "white" : "black";
    if (score[blackOrWhite] !== newScore[blackOrWhite]) {
      setTurn(turn === 1 ? 0 : 1);
    }
    setScore(newScore);
  };
  return (
    <section>
      <h1 className="title">Othello</h1>

      <section className="sub-heading">
        White: {score.white} Black: {score.black} <br />
        {turn === 1 ? "Black" : "White"}'s Turn
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
    </section>
  );
}
