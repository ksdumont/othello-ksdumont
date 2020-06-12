import React, { useState, useEffect } from "react";
import GameHelper from "../Util/GameHelper";
import Cell from "../Components/Cell";

export default function Game(props) {
  const [gameField, setGameField] = useState(GameHelper.generateBoard());
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState({});

  useEffect(() => {
    setScore(GameHelper.pieceCount(gameField));
  }, []);

  const makeMove = (row, cell) => {
    // valid ?
    setGameField(GameHelper.evaluateMove(row, cell, gameField, turn));
    console.log(row, cell);
    // change turn
    setTurn(turn === 1 ? 0 : 1);
  };

  return (
    <section>
      <h1>Othello</h1>
      <p>
        White: {score.white} Black: {score.black} <br />
        Turn: {turn === 1 ? "black" : "white"}
      </p>
      {gameField.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <Cell row={i} cell={j} onMove={makeMove} key={j} color={cell} />
          ))}
        </div>
      ))}
    </section>
  );
}
