import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board

 *  (chanceLightStartsOn: float, chance any cell is lit at start of game)-replaced this
 with min and max so that the board should always be winnable

 *-min the min amount of random coords
 *-max the max amount of random coords
 *
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, min = 6, max = 15 }) {
  //sets the initialBoard so that the board can be reset and players can try again with the same board if they get stuck
  const [initBoard, setinitBoard] = useState(createBoard());
  const [board, setBoard] = useState(initBoard);

  //moved this out of flipCellsAround and changed it, so that it can be used to set up the board too
  //toggles the light and the lights around it given their coords
  function flipCells(coords, boardCopy) {
    for (var i = 0; i < coords.length; i++) {
      const [y, x] = coords[i];
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        boardCopy[y][x] = !boardCopy[y][x];
      }
    }
  }

  //returns a random coord and the coords around it
  function getRandCoords() {
    const y = Math.floor(Math.random() * nrows);
    const x = Math.floor(Math.random() * ncols);
    return [
      [y, x],
      [y + 1, x],
      [y - 1, x],
      [y, x + 1],
      [y, x - 1],
    ];
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    //starts with a board that has all the lights off
    for (let i = 0; i < nrows; i++) {
      let newRow = [];
      for (let i = 0; i < ncols; i++) {
        newRow.push(false);
      }
      initialBoard.push(newRow);
    }

    //randomly chosses the lights to flip
    //
    // it will randomly chosses a cell and then filp that cell and the ones around it
    //it will do this a random number of times, giving a random board
    //
    //this should make it to where the board is always winnable
    while (hasWon(initialBoard)) {
      const numOfMoves = Math.floor(Math.random() * max - min) + min;
      for (var i = 0; i < numOfMoves; i++) {
        flipCells(getRandCoords(), initialBoard);
      }
    }

    return initialBoard;
  }

  /// gets the fliped cells and sets the new board
  function flipCellsAround(y, x) {
    setBoard((oldBoard) => {
      const coords = [
        [y, x],
        [y + 1, x],
        [y - 1, x],
        [y, x + 1],
        [y, x - 1],
      ];
      const boardCopy = oldBoard.map((row) => [...row]);
      flipCells(coords, boardCopy);
      return boardCopy;
    });
  }

  //returns true if all lights are off and false if not
  function hasWon(gameBoard = board) {
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i].indexOf(true) != -1) {
        return false;
      }
    }
    return true;
  }

  function newGame() {
    let newGameBoard = createBoard();
    setBoard((n) => (n = newGameBoard));
    setinitBoard((n) => (n = newGameBoard));
  }

  //if you win the game show "You Won!" if not show the board
  return (
    <>
      <button
        className="Board-NewGame"
        type="button"
        name="button"
        onClick={newGame}
      >
        New Game
      </button>
      {hasWon() ? (
        <h1 className="Board-win">You Won!</h1>
      ) : (
        <div className="Board">
          <button
            type="button"
            name="button"
            onClick={() => setBoard((n) => (n = initBoard))}
          >
            Reset Game
          </button>
          <table>
            <tbody>
              {board.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((col, cIdx) => (
                    <Cell
                      key={cIdx}
                      flipCellsAroundMe={() => flipCellsAround(rIdx, cIdx)}
                      isLit={col}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Board;
