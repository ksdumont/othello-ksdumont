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
    this.globalVars.game = rows;
    return rows;
  },
  globalVars: {
    potential: [],
    game: [],
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
    switch (direction) {
      case "top":
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
        for (let i = cell + 1; i <= 7; i++) {
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
        for (let i = row + 1; i < 8; i++) {
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
        offset = cell;
        for (let i = row + 1; i < 8; i++) {
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
        offset = cell;
        for (let i = row - 1; i >= 0; i--) {
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
      default:
        return game;
    }

    return this.globalVars.game;
  },
  checkCellValue(condition, row, cell, turn, nextDirection, potentialValues) {
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
