

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
    if (first.col == second.col || first.row == second.row) 
        {
            this.swapPieces(first, second);
            let m = this.isMatch(first, second);
            this.swapPieces(first, second);
            return m;      
        }
        return false;
  }

  move(first: Position, second: Position) {
    // return this.checkIfPiecesMatch(first,second);
    
  }

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

   findMatchInRows(row?: number) {
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

  private findMatchInColumns(rowI:boolean, num:number) {
    let match = false;
    const p = this.pieces.filter((element) => {
      if(rowI){
        return element.position.row == num;
      }
      else {
        return element.position.col == num;
      }
      
    });

    for (var j = 0; j < p.length; j++){
      if (j == 0){
        if(p[j].value == p[j+1].value && p[j].value == p[j+2].value)
        {
          match = true;
          break;
        }
      }
      else if (j > 0 && j != (p.length - 1)){
        if(p[j].value == p[j+1].value && p[j].value == p[j-1].value)
        {
          match = true;
          break;
        }
      }
    }
    return match;
  }

  private isMatch(first: Position, second: Position)
  {
    let isFirstHorizontalMatch = this.findMatch(first.row, true);
    let isSecondHorizontalMatch = this.findMatch(second.row, true);
    let isFirstVerticalMatch = this.findMatch(first.col, false);
    let isSecondVerticalMatch = this.findMatch(second.col, false);
    let match = (isFirstHorizontalMatch || isSecondHorizontalMatch || isFirstVerticalMatch || isSecondVerticalMatch)
    return match;
  }
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

// private checkIfPiecesMatch(board: Board, position:Position): boolean 
// {
//   const top1 = {x: position.x - 1, y: position.y};
//   const top2 = {x: position.x - 2, y: position.y};
//   const bottom1 = {x: position.x + 1, y: position.y};
//   const bottom2 = {x: position.x + 2, y: position.y};

//   const left1 = {x: position.x, y: position.y - 1};
//   const left2 = {x: position.x, y: position.y - 2};
//   const right1 = {x: position.x, y: position.y + 1};
//   const right2 = {x: position.x, y: position.y + 2};
  
//   if (board.findMatchInRows (position, right1) && board.findMatchInRows(position, right2)) {
//     return true;
// }
//  // Check if horizontal match with this cell in middle.
//  if (board.findMatchInRows (position, left1) && board.findMatchInRows(position, right1)) {
//   return true;
// }

// // Check if horizontal match with this cell in right.
// if (board.findMatchInRows (position, left1) && board.findMatchInRows(position, left2)) {
//   return true;
// }

// // Check if vertical match with this cell in top.
// if (board.findMatchInRows (position, bottom1) && board.findMatchInRows (position, bottom2)) {
//   return true;
// }

// // Check if vertical match with this cell in middle.
// if (board.findMatchInRows (position, top1) && board.findMatchInRows (position, bottom1)) {
//   return true;
// }

// // Check if vertical match with this cell in bottom.
// if (board.findMatchInRows (position, top1) && board.findMatchInRows (position, top2)) {
//   return true;
// }

// return false;
// }

// // ----------------------------------------------------------------------------------

// private comparePositions (pos1: Position, pos2: Position): boolean {
//   return (pos1=== pos2);
// }

//  doMatch (first: Position, second:Position): boolean {
//   if (first === second) {
//       return true;
//   }

//   return false;
// }

// refill(): void {
//   for (let x = 0; x < this.width; x++) {
//     for (let y = this.height - 1; y >= 0; y--) {
//       const cell = this.at({ x, y });

//       if (cell.empty) {
//         cell.set(this.generator());
//       }
//     }
//   }
// }



  
}
