import React from "react";

export default function Cell({ color }) {
  return (
    <div className="cell">
      <div
        className={
          "piece " + (color === 1 ? "black" : color === 0 ? "white" : "")
        }
      ></div>
    </div>
  );
}
