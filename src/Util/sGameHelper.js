const helper = {
  generateBoard() {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      let cells = [];
      for (let j = 0; j < 8; j++) {
        if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
          cells.push(0);
        } else if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
          cells.push(1);
        } else {
          cells.push(null);
        }
      }
      rows.push(cells);
    }
    // debug
    // rows = [
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 0, 0, null],
    //   [1, 1, 1, 1, 1, 1, 1, null],
    // ];
    this.globalVars.game = rows;
    return rows;
  },
  globalVars: {
    potential: [],
    game: [],
    virtual: false, // a flag to know if we want to execute the flips, check to see if there are potentials to know if there is a valid move
  },
  checkGameStatus(turn) {
    this.globalVars.virtual = true;
    // all fields are not null
    let openCell = false;
    let movePossible = false;
    this.globalVars.game.forEach((row) => {
      row.forEach((cell) => {
        if (cell === null) {
          openCell = true;
          if (!movePossible) {
            this.evaluateMove(row, cell, this.globalVars.game, turn); //in virtual mode
            console.log(this.globalVars.potential);
            movePossible = this.globalVars.potential.length > 0;
          }
        }
      });
    });
    this.globalVars.virtual = false;
    return {
      movePossible,
      gameRunning: openCell,
    };
  },
  evaluateMove(row, cell, game, turn, direction = "top") {
    const directions = [
      "top",
      "topright",
      "right",
      "bottomright",
      "bottom",
      "bottomleft",
      "left",
      "topleft",
    ];
    let currentDirectionIndex = directions.indexOf(direction);
    if (currentDirectionIndex === -1) {
      // ?
      return game;
    }
    if (!this.globalVars.virtual) {
      // only clearing potentials if we actually flip, not the case in virtual
      this.globalVars.potential = [];
    }

    this.globalVars.game = game;
    let offset;

    switch (direction) {
      case "top":
        if (row === 0) {
          this.checkCellValue(
            game[0][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [0, cell]
          );
        }
        for (let i = row - 1; i >= 0; i--) {
          if (
            this.checkCellValue(
              game[i][cell],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [i, cell]
            )
          ) {
            break;
          }
        }
        break;
      case "topright":
        offset = 0;
        if (row === 0) {
          this.checkCellValue(
            game[0][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [0, cell]
          );
        }
        for (let i = row - 1; i >= 0; i--) {
          offset++;
          if (
            this.checkCellValue(
              game[i][cell + offset],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [i, cell + offset]
            )
          ) {
            break;
          }
        }
        break;
      case "right":
        for (let i = cell + 1; i <= 8; i++) {
          if (
            this.checkCellValue(
              game[row][i],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [row, i]
            )
          ) {
            break;
          }
        }
        break;
      case "bottomright":
        if (row === 7) {
          this.checkCellValue(
            game[7][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [7, cell]
          );
        }
        offset = 0;
        for (let i = row + 1; i <= 7; i++) {
          offset++;
          if (
            this.checkCellValue(
              game[i][cell + offset],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [i, cell + offset]
            )
          ) {
            break;
          }
        }
        break;
      case "bottom":
        if (row === 7) {
          this.checkCellValue(
            game[7][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [7, cell]
          );
        }
        for (let i = row + 1; i <= 7; i++) {
          if (
            this.checkCellValue(
              game[i][cell],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [i, cell]
            )
          ) {
            break;
          }
        }
        break;
      case "bottomleft":
        if (row === 7) {
          this.checkCellValue(
            game[7][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [7, cell]
          );
        }
        offset = cell;
        for (let i = row + 1; i <= 7; i++) {
          offset--;
          if (
            this.checkCellValue(
              game[i][offset],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [i, offset]
            )
          ) {
            break;
          }
        }
        break;
      case "left":
        for (let i = cell - 1; i >= 0; i--) {
          if (
            this.checkCellValue(
              game[row][i],
              row,
              cell,
              turn,
              directions[currentDirectionIndex + 1],
              [row, i]
            )
          ) {
            break;
          }
        }
        break;
      case "topleft":
        if (row === 0) {
          this.checkCellValue(
            game[0][cell],
            row,
            cell,
            turn,
            directions[currentDirectionIndex + 1],
            [0, cell]
          );
        }
        offset = cell;
        for (let i = row - 1; i >= 0; i--) {
          offset--;
          if (
            this.checkCellValue(game[i][offset], row, cell, turn, null, [
              i,
              offset,
            ])
          ) {
            break;
          }
        }
        break;
      default:
        return game;
    }

    return this.globalVars.game;
  },
  checkCellValue(condition, row, cell, turn, nextDirection, potentialValues) {
    if (
      typeof condition === "undefined" ||
      typeof this.globalVars.game[row] === "undefined" ||
      typeof this.globalVars.game[row][cell] === "undefined"
    ) {
      return this.evaluateMove(
        row,
        cell,
        this.globalVars.game,
        turn,
        nextDirection
      );
    }

    if (condition === null) {
      return this.evaluateMove(
        row,
        cell,
        this.globalVars.game,
        turn,
        nextDirection
      );
    }
    if (condition !== turn) {
      this.globalVars.potential.push(potentialValues);

      //upwards direction
      if (
        potentialValues[0] === 0 &&
        ["topleft", "top", "topright"].includes(nextDirection)
      ) {
      }

      //downward directions
      if (
        potentialValues[0] === 7 &&
        ["bottomright", "bottom", "bottomleft"].includes(nextDirection)
      ) {
      }

      if (typeof this.globalVars.game[potentialValues[0] + 1] === "undefined") {
        return this.evaluateMove(
          row,
          cell,
          this.globalVars.game,
          turn,
          nextDirection
        );
      }
    }
    if (condition === turn) {
      this.globalVars.game = this.completeDirection(row, cell, turn);
      if (nextDirection) {
        return this.evaluateMove(
          row,
          cell,
          this.globalVars.game,
          turn,
          nextDirection
        );
      }
      return this.globalVars.game;
    }
    return false;
  },

  completeDirection(row, cell, turn) {
    if (!this.globalVars.virtual) {
      this.globalVars.potential.forEach((flip) => {
        this.globalVars.game[flip[0]][flip[1]] = turn;
      }); // the actual flip
      if (this.globalVars.potential.length > 0) {
        this.globalVars.game[row][cell] = turn; // the piece getting placed
      }
    }
    return this.globalVars.game;
  },

  pieceCount(game) {
    let black = 0;
    let white = 0;
    game.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 0) {
          white++;
        }
        if (cell === 1) {
          black++;
        }
      });
    });

    return {
      black,
      white,
    };
  },
};

export default helper;

// game below

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
      // check if possible for other player
      let gameEndCheck = gameHelper.checkGameStatus(
        turn === 0 ? 1 : 0,
        gameField
      );
      if (!gameEndCheck.movePossible) {
        // game over
        console.log("set game over");
      } else {
        // prompt skipping player
        alert("Skipping player");
        console.log("switch turn");
        setTurn(turn === 0 ? 1 : 0);
      }
    }
    console.log(gameStatus);
    setGameRunning(gameStatus.gameRunning);
    console.log(gameField);
  }, [gameField, turn]);
  const makeMove = (row, cell) => {
    console.log("mode:" + gameHelper.globalVars.virtual);
    // valid?
    setGameField(gameHelper.evaluateMove(row, cell, gameField, turn));
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
      <h1>Othello</h1>
      <p>
        White: {score.white} Black: {score.black} <br />
        Turn: {turn === 1 ? "black" : "white"} <br />
        The game is {gameRunning ? "on" : "done."} <br />
        {gameRunning
          ? ""
          : "Winner is: " + (score.white > score.black ? "White" : "Black")}
      </p>
      <div>
        <button onClick={newGame}>new game</button>
      </div>

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
