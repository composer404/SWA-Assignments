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

export type BoardEvent<T> = {};

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
    return false;
  }

  move(first: Position, second: Position) {}

  /* -------------------------------------------------------------------------- */
  /*                                   HELPERS                                  */
  /* -------------------------------------------------------------------------- */

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

/* ----------------- Check if pieces match ---------------- */

private checkIfPiecesMatch(board: Board, position:Position): boolean 
{
  const top1 = {x: position.x - 1, y: position.y};
  const top2 = {x: position.x - 2, y: position.y};
  const bottom1 = {x: position.x + 1, y: position.y};
  const bottom2 = {x: position.x + 2, y: position.y};

  const left1 = {x: position.x, y: position.y - 1};
  const left2 = {x: position.x, y: position.y - 2};
  const right1 = {x: position.x, y: position.y + 1};
  const right2 = {x: position.x, y: position.y + 2};
  
//   if (board.doCandiesMatch (position, right1) && board.doCandiesMatch(cellPos, right2)) {
//     return true;
// }
}



  
}
