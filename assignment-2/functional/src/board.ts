export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}    

export type Match<T> = {
    matched: T,
    positions: Position[]
}    

export type Piece<T> = {
  value: T;
  position: Position;
};

export type Board<T> = {
    width: number;
    height: number;
    pieces: Piece<T>[];
};

export type Effect<T> = {
  kind: string;
};

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}    

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
  return { 
    width, 
    height, 
    pieces: this.initBoardFill(generator, height, width)
  }
}    

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if (!this.isPositionOutsideBoard(board, p)) {
        return undefined;
      }
      return this.findPieceOnPosition(board, p).value;
}    

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    return this.isMoveLegal(first, second);
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
  return undefined;
}

export function isPositionOutsideBoard<T>(board: Board<T>, p: Position): boolean {
    if (p.col >= board.width || p.col < 0) {
      return false;
    }

    if (p.row >= board.height || p.row < 0) {
      return false;
    }
    return true;
  }

export function findPieceOnPosition<T>(board: Board<T>, position: Position) {
    return board.pieces.find((element) => {
      return (
        element.position.col == position.col &&
        element.position.row == position.row
      );
    });
  }

  export function isMoveLegal(
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

  export function initBoardFill<T>(generator: Generator<T>, height: number, width: number): Piece<T>[] {
    const pieces: Piece<T>[] = []
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        pieces.push({
          value: generator.next(),
          position: {
            row,
            col,
          },
        });
      }
    }
    return pieces;
  }
