export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}    

export enum CHECK_DIRECTION {
  LEFT = `Left`,
  RIGHT = `Right`,
  TOP = `Top`,
  DOWN = `Down`,
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
    return this.isMoveLegal(board, first, second);
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
  return undefined;
}

export function isMoveLegal<T>(
  board: Board<T>,
  firstPosition: Position,
  secondPosition: Position
): boolean {
  if (
    !this.isPositionOutsideBoard(board, firstPosition) ||
    !this.isPositionOutsideBoard(board, secondPosition)
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

  this.swapPieces(board, firstPosition, secondPosition);
  const matchesInRows = this.getAllRowMatches(board);
  const matchesInColumns = this.getAllColumnMatches(board);
  this.swapPieces(board, firstPosition, secondPosition);

  if (!matchesInRows.length && !matchesInColumns.length) {
    return false;
  }
  return true;
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

export function swapPieces<T>(board: Board<T>, first: Position, second: Position) {
  const firstPiece = this.findPieceOnPosition(board, first);
  const secondPiece = this.findPieceOnPosition(board, second);

  const firstIndex = board.pieces.indexOf(firstPiece);
  const secondIndex = board.pieces.indexOf(secondPiece);

  const firstPieceValue = firstPiece.value;
  const secondPieceValue = secondPiece.value;

  board.pieces[firstIndex].value = secondPieceValue;
  board.pieces[secondIndex].value = firstPieceValue;
}

export function findPieceOnPosition<T>(board: Board<T>, position: Position) {
  return board.pieces.find((element) => {
    return (
      element.position.col == position.col &&
      element.position.row == position.row
    );
  });
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

/* ----------------------- COLUMN MATCHES WITH RECURSTION ---------------------- */

export function getAllColumnMatches<T>(board: Board<T>) {
  let matches: Piece<T>[] = [];
  for (let i = 0; i < board.width; i++) {
    const checkedValues: T[] = [];
    const elementsInColumn = this.getAllPiecesInColumn(board, i);
    for (const element of elementsInColumn) {
      if (!checkedValues.includes(element.value)) {
        checkedValues.push(element.value);
        matches = matches.concat(this.columnDeepNeighbourCheck(board,element));
        // if matches not empty array fire event
      }
    }
  }
  return matches;
}

export function columnDeepNeighbourCheck<T>(board: Board<T>, startPiece: Piece<T>) {
  const nextTopPosition = this.findNextPieceInColumnPosition(
    startPiece,
    CHECK_DIRECTION.TOP
  );
  const pieceOnNextTopPosition = this.findPieceOnPosition(board, nextTopPosition);
  const topElements = this.neighourCheckColumn(board,
    pieceOnNextTopPosition,
    [],
    startPiece.value,
    CHECK_DIRECTION.TOP
  );
  const downElements = this.neighourCheckColumn(board,
    this.findPieceOnPosition(board,
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

export function neighourCheckColumn<T>(
  board: Board<T>,
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
      board,
      this.findNextPieceInColumnPosition(currentPiece, checkDirection)
    );
    this.neighourCheckColumn(
      board,
      nextPiece,
      matchingPieces,
      value,
      checkDirection
    );
  }
  return matchingPieces;
}

export function findNextPieceInColumnPosition<T>(
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

export function findNextPieceInRowPosition<T>(
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

export function getAllRowMatches<T>(board: Board<T>) {
  let matches: Piece<T>[] = [];
  for (let i = 0; i < board.height; i++) {
    const checkedValues: T[] = [];
    const elementsInRow = this.getAllPiecesInRow(board, i);
    for (const element of elementsInRow) {
      if (!checkedValues.includes(element.value)) {
        checkedValues.push(element.value);
        matches = matches.concat(this.rowDeepNeighbourCheck(board, element));
        // if matches not empty array fire event
      }
    }
  }
  return matches;
}

export function rowDeepNeighbourCheck<T>(board: Board<T>, startPiece: Piece<T>) {
  const leftSideElements = this.neighourCheck(board,
    this.findPieceOnPosition(board,
      this.findNextPieceInRowPosition(startPiece, CHECK_DIRECTION.LEFT)
    ),
    [],
    startPiece.value,
    CHECK_DIRECTION.LEFT
  );
  const rightSideElements = this.neighourCheck(board,
    this.findPieceOnPosition(board,
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

export function neighourCheck<T>(
  board: Board<T>,
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
    const nextPiece = this.findPieceOnPosition(board,
      this.findNextPieceInRowPosition(currentPiece, checkDirection)
    );
    this.neighourCheck(board, nextPiece, matchingPieces, value, checkDirection);
  }
  return matchingPieces;
}

export function getAllPiecesInRow<T>(board: Board<T>, rowIndex: number) {
  return board.pieces.filter((element) => {
    return element.position.row === rowIndex;
  });
}

export function getAllPiecesInColumn<T>(board: Board<T>, columnIndex: number) {
  return board.pieces.filter((element) => {
    return element.position.col === columnIndex;
  });
}

