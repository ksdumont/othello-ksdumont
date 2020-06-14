import React from "react";

export default function Cell({ color, row, cell, onMove }) {
  const makeMove = () => {
    if (color === null) {
      onMove(row, cell);
    }
  };
  return (
    <div className="cell">
      <div
        onClick={makeMove}
        className={
          "piece " + (color === 1 ? "black" : color === 0 ? "white" : "")
        }
      ></div>
    </div>
  );
}
