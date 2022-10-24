export type Generator<T> = { next: () => T };

export enum CHECK_DIRECTION {
  LEFT = `Left`,
  RIGHT = `Right`,
  TOP = `Top`,
  DOWN = `Down`,
}

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
    // if (!this.isPositionOutsideBoard(first) || !this.isPositionOutsideBoard(second))
    //     {
    //         return false;
    //     }

    //     if (first.col == second.col || first.row == second.row)
    //     {
    //         this.swapPieces(first, second);
    //         let m = this.isMatch(first, second);
    //         this.swapPieces(first, second);
    //         return m;
    //     }
    //     return false;
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

    this.swapPieces(firstPosition, secondPosition);
    const matchesInRows = this.getAllRowMatches();
    const matchesInColumns = this.getAllColumnMatches();
    this.swapPieces(firstPosition, secondPosition);

    if (!matchesInRows.length && !matchesInColumns.length) {
      return false;
    }
    // if (firstPosition.col === secondPosition.col) {
    //   this.swapPieces(firstPosition, secondPosition);
    // this.swapPieces(firstPosition, secondPosition);
    // const isFirstRowMatch = this.findMatchInRows(firstPosition.row);
    // const isSecondRowMatch = this.findMatchInRows(secondPosition.row);
    // if (!isFirstRowMatch && !isSecondRowMatch) {
    //   return false;
    // }
    // }
    return true;
  }

  // private isMatch(first: Position, second: Position) {
  // let isFirstHorizontalMatch = this.findMatchInRows(first.row, true);
  // let isSecondHorizontalMatch = this.findMatchInRows(second.row, true);
  // let match = (isFirstHorizontalMatch || isSecondHorizontalMatch || isFirstVerticalMatch || isSecondVerticalMatch)
  // return match;
  // }

  //  findMatchInRows(row?: number) {
  //   if (row > this.height) {
  //     return;
  //   }
  //   if (!row) {
  //     row = 0;
  //   }
  //   const piecesInRow = this.pieces.filter((element) => {
  //     return element.position.row === row;
  //   });
  //   const pieces = this.countPiecesInArray(piecesInRow);

  //   let matchFound = false;
  //   for (const piece in pieces) {
  //     if (pieces[piece] >= 3) {
  //       matchFound = true;
  //     }
  //   }

  //   return matchFound;
  // }

  // private countPiecesInArray(arr: Piece<T>[]): {} {
  //   const result = {} as any;

  //   arr.forEach((element) => {
  //     if (result[element.value]) {
  //       result[element.value] += 1;
  //     } else {
  //       result[element.value] = 1;
  //     }
  //   });
  //   return result;
  // }
  //====================here
  // private findMatchInColumns(col?:number) {
  //   if(col> this.width)
  //   {
  //     return;
  //   }
  //   if(!col){
  //     col=0;
  //   }
  //   const piecesInCol = this.pieces.filter((element)=>{
  //     return element.position.column === col;
  //   });
  //   const pieces = this.countPiecesInArray(piecesInCol);
  //   let matchFound = false;
  //   for (const piece in pieces) {
  //     if (pieces[piece] >= 3) {
  //       matchFound = true;
  //     }
  //   }

  //   return matchFound;
  // }

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

  // pieceDragged: Piece;
  // pieceReplaced: Piece;
  // pieceIdDragged: Piece;
  // pieceIdReplaced: Piece;

  // pieces.forEach((piece: Piece) => {
  //   piece.addListener('dragstart',dragStart)});

  // this.pieces.forEach(piece => piece.addListener('dragend',dragEnd)),
  // this.pieces.forEach(piece => piece.addListener('dragover',dragOver)),
  // this.pieces.forEach(piece => piece.addListener('dragenter',dragEnter)),
  // this.pieces.forEach(piece => piece.addListener('dragleave',dragLeave)),
  // this.pieces.forEach(piece => piece.addListener('drop',dragDrop)),

  //  dragStart():Piece<T>{
  //   pieceIdDragged = parseInt(this.id)
  //   // this.style.backgroundImage = ''
  // }

  //  dragOver(e):Piece<T> {
  //   e.preventDefault()
  // }

  //  dragEnter(e) :Piece<T>{
  //   e.preventDefault()
  // }

  //  dragLeave():Piece<T> {
  //   this.piece = ''
  // }
  /* ----------------------- ROW MATCHES WITH RECURSTION ---------------------- */

  private getAllColumnMatches() {
    let matches: Piece<T>[] = [];
    for (let i = 0; i < this.width; i++) {
      const checkedValues: T[] = [];
      const elementsInColumn = this.getAllPiecesInColumn(i);
      for (const element of elementsInColumn) {
        if (!checkedValues.includes(element.value)) {
          checkedValues.push(element.value);
          matches = matches.concat(this.columnDeepNeighbourCheck(element));
          // if matches not empty array fire event
        }
      }
    }
    return matches;
  }

  private columnDeepNeighbourCheck(startPiece: Piece<T>) {
    const nextTopPosition = this.findNextPieceInColumnPosition(
      startPiece,
      CHECK_DIRECTION.TOP
    );
    const pieceOnNextTopPosition = this.findPieceOnPosition(nextTopPosition);
    const topElements = this.neighourCheckColumn(
      pieceOnNextTopPosition,
      [],
      startPiece.value,
      CHECK_DIRECTION.TOP
    );
    const downElements = this.neighourCheckColumn(
      this.findPieceOnPosition(
        this.findNextPieceInColumnPosition(startPiece, CHECK_DIRECTION.DOWN)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.DOWN
    );

    if (topElements.length + downElements.length + 1 >= 3) {
      return [...topElements, ...downElements, startPiece];
    }

    return [];
  }

  private neighourCheckColumn(
    currentPiece: Piece<T>,
    matchingPieces: Piece<T>[],
    value: T,
    checkDirection: CHECK_DIRECTION
  ) {
    if (!currentPiece) {
      return matchingPieces;
    }
    if (currentPiece.value === value) {
      matchingPieces.push(currentPiece);

      const nextPiece = this.findPieceOnPosition(
        this.findNextPieceInColumnPosition(currentPiece, checkDirection)
      );
      this.neighourCheckColumn(
        nextPiece,
        matchingPieces,
        value,
        checkDirection
      );
    }
    return matchingPieces;
  }

  findNextPieceInColumnPosition(
    currentPiece: Piece<T>,
    direction: CHECK_DIRECTION
  ) {
    let position: Position = {
      row: currentPiece.position.row,
      col: currentPiece.position.col,
    };
    if (direction === CHECK_DIRECTION.DOWN) {
      position.row += 1;
    }

    if (direction === CHECK_DIRECTION.TOP) {
      position.row -= 1;
    }
    return position;
  }

  findNextPieceInRowPosition(
    currentPiece: Piece<T>,
    direction: CHECK_DIRECTION
  ) {
    let position: Position = {
      row: currentPiece.position.row,
      col: currentPiece.position.col,
    };
    if (direction === CHECK_DIRECTION.LEFT) {
      position.col -= 1;
    }

    if (direction === CHECK_DIRECTION.RIGHT) {
      position.col += 1;
    }
    return position;
  }

  /* ----------------------- ROW MATCHES WITH RECURSTION ---------------------- */

  private getAllRowMatches() {
    let matches: Piece<T>[] = [];
    for (let i = 0; i < this.height; i++) {
      const checkedValues: T[] = [];
      const elementsInRow = this.getAllPiecesInRow(i);
      for (const element of elementsInRow) {
        if (!checkedValues.includes(element.value)) {
          checkedValues.push(element.value);
          matches = matches.concat(this.rowDeepNeighbourCheck(element));
          // if matches not empty array fire event
        }
      }
    }
    return matches;
  }

  private rowDeepNeighbourCheck(startPiece: Piece<T>) {
    const leftSideElements = this.neighourCheck(
      this.findPieceOnPosition(
        this.findNextPieceInRowPosition(startPiece, CHECK_DIRECTION.LEFT)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.LEFT
    );
    const rightSideElements = this.neighourCheck(
      this.findPieceOnPosition(
        this.findNextPieceInRowPosition(startPiece, CHECK_DIRECTION.RIGHT)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.RIGHT
    );

    if (leftSideElements.length + rightSideElements.length + 1 >= 3) {
      return [...leftSideElements, ...rightSideElements, startPiece];
    }

    return [];
  }

  private neighourCheck(
    currentPiece: Piece<T>,
    matchingPieces: Piece<T>[],
    value: T,
    checkDirection: CHECK_DIRECTION
  ) {
    if (!currentPiece) {
      return matchingPieces;
    }
    if (currentPiece.value === value) {
      matchingPieces.push(currentPiece);
      const nextPiece = this.findPieceOnPosition(
        this.findNextPieceInRowPosition(currentPiece, checkDirection)
      );
      this.neighourCheck(nextPiece, matchingPieces, value, checkDirection);
    }
    return matchingPieces;
  }

  private getAllPiecesInRow(rowIndex: number) {
    return this.pieces.filter((element) => {
      return element.position.row === rowIndex;
    });
  }

  private getAllPiecesInColumn(columnIndex: number) {
    return this.pieces.filter((element) => {
      return element.position.col === columnIndex;
    });
  }

  // private checkRowForThree() {
  //   for (let i = 0; i < width; i++) {
  //     let rowOfThree = [i, i + 1, i + 2];
  //     let decidedPiece = pieces[i];
  //     const isBlank = pieces[i] === "";

  //     if (
  //       rowOfThree.every((index) => pieces[index] === decidedPiecer && !isBlank)
  //     ) {
  //       rowOfThree.forEach((index) => {
  //         pieces[index] = "";
  //       });
  //     }
  //   }
  // }

  //--------------------------------------------------------------------------

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
