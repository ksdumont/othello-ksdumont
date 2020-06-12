import React, { useState, useEffect } from "react";
import GameHelper from "../Util/GameHelper";
import Cell from "../Components/Cell";
export default function Game(props) {
  const [gameField, setGameField] = useState([]);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    setGameField(GameHelper.generateBoard());
  }, []);

  return (
    <section>
      <h1>Othello</h1>
      {gameField.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, i) => (
            <Cell key={i} color={cell} />
          ))}
        </div>
      ))}
    </section>
  );
}
