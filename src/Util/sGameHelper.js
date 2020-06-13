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
    rows = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, null],
    ];
    this.globalVars.game = rows;
    return rows;
  },
  globalVars: {
    potential: [],
    game: [],
  },
  checkGameStatus() {
    // all fields are not null
    let openCell = false;
    this.globalVars.game.forEach((row) => {
      row.forEach((cell) => {
        if (cell === null) {
          openCell = true;
        }
      });
    });

    return openCell;
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
      return game;
    }

    this.globalVars.potential = [];
    this.globalVars.game = game;
    let offset;
    console.log("do " + direction);
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
          console.log("in");
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
      console.log(potentialValues);
      if (
        nextDirection === "bottomleft" &&
        typeof this.globalVars.game[potentialValues[0] + 1] === "undefined"
      ) {
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
    this.globalVars.potential.forEach((flip) => {
      this.globalVars.game[flip[0]][flip[1]] = turn;
    });
    if (this.globalVars.potential.length > 0) {
      this.globalVars.game[row][cell] = turn;
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
