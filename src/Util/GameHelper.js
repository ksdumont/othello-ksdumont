const helper = {
  /* Generate initial board state */
  generateBoard() {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      let cells = [];
      for (let j = 0; j < 8; j++) {
        if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
          cells.push(0); //represents the color white
        } else if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
          cells.push(1); //represents the color black
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
    potential: [], // store what could potentially get flipped in a turn, provided will find its own color eventually
    game: [],
    virtual: false, // a flag to know if we want to execute the flips, check to see if there are potentials to know if there is a valid move
  },

  /* Prevent running through all directions if nothing is next to the cell that is clicked, i.e. surrounded by nulls */
  hasNeighbor(game, rowIndex, cellIndex) {
    let found = false;
    let above = game[rowIndex - 1];
    let below = game[rowIndex + 1];
    let nearField = [];
    if (typeof above !== "undefined") {
      nearField.push([
        game[rowIndex - 1][cellIndex - 1],
        game[rowIndex - 1][cellIndex],
        game[rowIndex - 1][cellIndex + 1],
      ]);
    } else {
      return false;
    }
    nearField.push([
      game[rowIndex][cellIndex - 1],
      game[rowIndex][cellIndex],
      game[rowIndex][cellIndex + 1],
    ]);
    if (typeof below !== "undefined") {
      nearField.push([
        game[rowIndex + 1][cellIndex - 1],
        game[rowIndex + 1][cellIndex],
        game[rowIndex + 1][cellIndex + 1],
      ]);
    }

    nearField.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== null) {
          found = true;
        }
      });
    });

    return found;
  },
  /* Check if there is a possible move to determine if Game is over */
  checkGameStatus(turn, game) {
    this.globalVars.potential = []; // clear potentials
    this.globalVars.virtual = true; // to ensure we're not flipping, check if next player can place a piece
    let openCell = false; // all fields are not null
    let movePossible = false;
    game.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === null) {
          openCell = true; // board is not full
          if (
            !movePossible &&
            game[rowIndex][cellIndex] === null &&
            this.hasNeighbor(game, rowIndex, cellIndex) // if none of the surrounding cells is from the other player, it can not be a valid move
          ) {
            this.evaluateMove(rowIndex, cellIndex, this.globalVars.game, turn); // in virtual mode
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
      // catches infinite looping through directions
      return game;
    }
    if (!this.globalVars.virtual) {
      this.globalVars.potential = []; // reset for every direction
    }
    this.globalVars.game = game;
    let offset;

    switch (direction) {
      case "top":
        if (row === 0) {
          // skip 'top' direction, if in top row
          this.evaluateMove(
            row,
            cell,
            game,
            turn,
            directions[currentDirectionIndex + 1]
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
          // skip 'bottom' direction, if in last row
          this.evaluateMove(
            row,
            cell,
            game,
            turn,
            directions[currentDirectionIndex + 1]
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
      // edge cases: if go outside of gameboard, catch it here
      typeof condition === "undefined" || // at outer border where the next cell doesn't exist
      typeof this.globalVars.game[row] === "undefined" || // end of board
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
    // opposing player's color
    if (condition !== turn) {
      this.globalVars.potential.push(potentialValues); // potential values passed in from the iteration
      // edge cases below
      // if collect potentials that dont lead to anything, i.e. top & bottom row & corners are undefined
      // potentialValues[0] = row, potentialValues[1] = cell
      if (
        (potentialValues[1] === 0 && // if upper left and bottom right corner
          (potentialValues[0] === 0 || potentialValues[0] === 7)) ||
        (potentialValues[1] === 7 && // or top right and bottom left
          (potentialValues[0] === 0 || potentialValues[0] === 7)) ||
        (potentialValues[0] === 0 && // if in first row and next direction is going upwards
          ["topleft", "top", "topright", "right"].includes(nextDirection)) ||
        (potentialValues[0] === 7 && // if in bottom row and next direction is downwards
          ["bottomright", "bottom", "bottomleft", "left"].includes(
            nextDirection
          ))
      ) {
        this.globalVars.potential = []; // clear the potential flips
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
      this.globalVars.game = this.completeDirection(row, cell, turn); // flip the pieces in the middle
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

  /* Flip all pieces in the middle */

  completeDirection(row, cell, turn) {
    if (!this.globalVars.virtual) {
      this.globalVars.potential.forEach((flip) => {
        // flip pieces in the middle
        this.globalVars.game[flip[0]][flip[1]] = turn;
      });
      if (this.globalVars.potential.length > 0) {
        this.globalVars.game[row][cell] = turn; // place piece
      }
    }
    return this.globalVars.game;
  },

  /* Get Score Count */

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
