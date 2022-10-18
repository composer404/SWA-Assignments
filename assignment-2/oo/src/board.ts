export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Match<T> = {
  matched: T;
  positions: Position[];
};

export type Piece<T> = {
  value: T;
  position: Position;
};

export type BoardEvent<T> = [];

export type BoardListener<T> = {};

export class Board<T> {
  width: number;
  height: number;

  pieces: Piece<T>[] = [];

  constructor(generator: Generator<T>, columns: number, rows: number) {
    this.width = columns;
    this.height = rows;

    this.initBoardFill(generator);
  }

  addListener(listener: BoardListener<T>) {}

  piece(p: Position): T | undefined {
    if (!this.isPositionOutsideBoard(p)) {
      return undefined;
    }
    return this.findPieceOnPosition(p).value;
  }

  canMove(first: Position, second: Position): boolean {
    return this.isMoveLegal(first, second);
    // return false;
  }

  move(first: Position, second: Position) {}

  /* -------------------------------------------------------------------------- */
  /*                                   HELPERS                                  */
  /* -------------------------------------------------------------------------- */

  private swapPieces(first: Position, second: Position) {
    const firstPiece = this.findPieceOnPosition(first);
    const secondPiece = this.findPieceOnPosition(second);

    const firstIndex = this.pieces.indexOf(firstPiece);
    const secondIndex = this.pieces.indexOf(secondPiece);

    const firstPieceValue = firstPiece.value;
    const secondPieceValue = secondPiece.value;

    this.pieces[firstIndex].value = secondPieceValue;
    this.pieces[secondIndex].value = firstPieceValue;
  }

  // private findPieceByPosition(position: Position): Piece<T> {
  //   return this.pieces.find((element) => {
  //       return element.position.row === position.row && element.position.col === position.col;
  //   });
  // }

  private isMoveLegal(
    firstPosition: Position,
    secondPosition: Position
  ): boolean {
    if (
      !this.isPositionOutsideBoard(firstPosition) ||
      !this.isPositionOutsideBoard(secondPosition)
    ) {
      return false;
    }
    if (
      firstPosition.col === secondPosition.col &&
      firstPosition.row === secondPosition.row
    ) {
      return false;
    }

    if (
      firstPosition.col !== secondPosition.col &&
      firstPosition.row !== secondPosition.row
    ) {
      return false;
    }

    if (firstPosition.col === secondPosition.col) {
      this.swapPieces(firstPosition, secondPosition);
      const isFirstRowMatch = this.findMatchInRows(firstPosition.row);
      const isSecondRowMatch = this.findMatchInRows(secondPosition.row);
      if (!isFirstRowMatch && !isSecondRowMatch) {
        return false;
      }
    }

    return true;
  }

  private isMatch() {}

  private findMatchInRows(row?: number) {
    if (row > this.height) {
      return;
    }
    if (!row) {
      row = 0;
    }
    const piecesInRow = this.pieces.filter((element) => {
      return element.position.row === row;
    });
    const pieces = this.countPiecesInArray(piecesInRow);

    let matchFound = false;
    for (const piece in pieces) {
      if (pieces[piece] >= 3) {
        matchFound = true;
      }
    }

    return matchFound;
  }

  private countPiecesInArray(arr: Piece<T>[]): {} {
    const result = {} as any;

    arr.forEach((element) => {
      if (result[element.value]) {
        result[element.value] += 1;
      } else {
        result[element.value] = 1;
      }
    });
    return result;
  }

  private findMatchInColumns(column: number) {}

  /* -------------- Checks if given position is outside the board ------------- */

  private isPositionOutsideBoard(p: Position): boolean {
    if (p.col >= this.width || p.col < 0) {
      return false;
    }

    if (p.row >= this.height || p.row < 0) {
      return false;
    }
    return true;
  }

  /* --------- Fills board using inital values given by the generator --------- */

  private initBoardFill(generator: Generator<T>) {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.pieces.push({
          value: generator.next(),
          position: {
            row,
            col,
          },
        });
      }
    }
  }

  /* ----------------- Finds first piece based on given postion ---------------- */

  private findPieceOnPosition(position: Position) {
    return this.pieces.find((element) => {
      return (
        element.position.col == position.col &&
        element.position.row == position.row
      );
    });
  }
}
