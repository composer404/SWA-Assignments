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

export type BoardEvent<T> = {
  kind: `Match` | `Refill`;
  match?: Match<T>;
};

export type BoardListener<T> = (event: BoardEvent<T>) => void;

export class Board<T> {
  width: number;
  height: number;

  eventsEnabled: boolean = false;
  generator: Generator<T>;

  pieces: Piece<T>[] = [];
  listeners: BoardListener<T>[] = [];

  constructor(generator: Generator<T>, columns: number, rows: number) {
    this.width = columns;
    this.height = rows;
    this.generator = generator;

    this.initBoardFill();
  }

  addListener(listener: BoardListener<T>) {
    this.listeners.push(listener);
  }

  piece(p: Position): T | undefined {
    if (!this.isPositionOutsideBoard(p)) {
      return undefined;
    }
    return this.findPieceOnPosition(p).value;
  }

  canMove(first: Position, second: Position): boolean {
    return this.isMoveLegal(first, second);
  }

  move(first: Position, second: Position): boolean {
    if (this.isMoveLegal(first, second)) {
      this.eventsEnabled = true;
      this.swapPieces(first, second);
      this.scanBoard();
      this.eventsEnabled = false;
    }
    return null;
  }

  private scanBoard() {
    const allRowMatches = this.getAllRowMatches();
    const allColumnMatches = this.getAllColumnMatches();
    if (allColumnMatches.length || allRowMatches.length) {
      this.removedMatchedValues(allRowMatches, allColumnMatches);
      this.refillBoard();
    }
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
    const matchesInRow = this.getAllRowMatches();
    const matchesInColumn = this.getAllColumnMatches();
    this.swapPieces(firstPosition, secondPosition);

    if (!matchesInRow.length && !matchesInColumn.length) {
      return false;
    }
    return true;
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

  private initBoardFill() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.pieces.push({
          value: this.generator.next(),
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

  /* ----------------------- ROW MATCHES WITH RECURSTION ---------------------- */

  private getAllColumnMatches() {
    let matches: Piece<T>[] = [];
    for (let i = this.width; i >= 0; i--) {
      const checkedValues: T[] = [];
      const elementsInColumn = this.getAllPiecesInColumn(i);
      for (const element of elementsInColumn) {
        // ! if to update (can break in larger tables)
        if (!checkedValues.includes(element.value)) {
          checkedValues.push(element.value);
          matches = matches.concat(this.columnDeepNeighbourCheck(element));
        }
      }
    }
    return matches;
  }

  private columnDeepNeighbourCheck(startPiece: Piece<T>) {
    const nextTopPosition = this.findNextPiecePosition(
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
        this.findNextPiecePosition(startPiece, CHECK_DIRECTION.DOWN)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.DOWN
    );

    if (topElements.length + downElements.length + 1 >= 3) {
      const matchedPieces = [...topElements, ...downElements, startPiece];
      if (this.eventsEnabled) {
        this.listeners.forEach((listener) => {
          listener({
            kind: `Match`,
            match: {
              matched: { ...matchedPieces[0] }.value,
              positions: matchedPieces
                .sort((a, b) => (a.position.row > b.position.row ? 1 : -1))
                .map((match) => match.position),
            },
          });
        });
      }
      return matchedPieces;
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
        this.findNextPiecePosition(currentPiece, checkDirection)
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

  /* ----------------------- ROW MATCHES WITH RECURSTION ---------------------- */

  private getAllRowMatches() {
    let matches: Piece<T>[] = [];
    for (let i = 0; i < this.height; i++) {
      const checkedValues: T[] = [];
      const elementsInRow = this.getAllPiecesInRow(i);
      for (const element of elementsInRow) {
        // ! if to update (can break in larger tables)
        if (!checkedValues.includes(element.value)) {
          checkedValues.push(element.value);
          matches = matches.concat(this.rowDeepNeighbourCheck(element));
        }
      }
    }
    return matches;
  }

  private rowDeepNeighbourCheck(startPiece: Piece<T>) {
    const leftSideElements = this.neighourCheck(
      this.findPieceOnPosition(
        this.findNextPiecePosition(startPiece, CHECK_DIRECTION.LEFT)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.LEFT
    );
    const rightSideElements = this.neighourCheck(
      this.findPieceOnPosition(
        this.findNextPiecePosition(startPiece, CHECK_DIRECTION.RIGHT)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.RIGHT
    );

    if (leftSideElements.length + rightSideElements.length + 1 >= 3) {
      const matchedPieces = [
        ...leftSideElements,
        ...rightSideElements,
        startPiece,
      ];

      if (this.eventsEnabled) {
        const matchedPositions = matchedPieces
          .sort((a, b) => (a.position.col > b.position.col ? 1 : -1))
          .map((match) => match.position);
        this.listeners.forEach((listener) => {
          listener({
            kind: `Match`,
            match: {
              matched: { ...matchedPieces[0] }.value,
              positions: matchedPositions,
            },
          });
        });
      }
      return matchedPieces;
    }

    return [];
  }

  /* -------------------------------------------------------------------------- */
  /*                          MOVING AND REFILING PART                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Description:
   * Calls a refill event and goes from left to right row by row.
   * When the empty piece is found it shifts all pieces above and put a new one on the top of the column.
   * Afterwards, scans the board again to see if new matches appered (Recursion)
   */

  private refillBoard(): void {
    this.listeners.forEach((listener) => {
      listener({
        kind: `Refill`,
      });
    });

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const foundElement = this.findPieceOnPosition({ row, col });
        if (foundElement.value === undefined) {
          this.shiftElementsInColumn(
            foundElement.position.row,
            foundElement.position.col
          );
          this.findPieceOnPosition({
            row: 0,
            col: foundElement.position.col,
          }).value = this.generator.next();
        }
      }
    }
    this.scanBoard();
  }

  /**
   * Description:
   * Starts from the given row and swaps elements one by one in the selected column from bottom to top until the end of the board.
   * @param fromRow the first row from which the shift will be executed
   * @param col column in which the shift will be executed
   */

  private shiftElementsInColumn(fromRow: number, col: number): void {
    for (let row = fromRow; row > 0; row--) {
      this.swapPieces({ row, col }, { row: row - 1, col });
    }
  }

  /**
   * Description:
   * For each matched pieces sets value as undefined
   * @param matchesRows matched pieces in rows
   * @param matchesColumn matched pieces in columns
   */

  private removedMatchedValues(
    matchesRows: Piece<T>[],
    matchesColumn: Piece<T>[]
  ): void {
    matchesRows.forEach((match) => {
      match.value = undefined;
    });
    matchesColumn.forEach((match) => {
      match.value = undefined;
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               HELPERS / UTILS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Description:
   * Returns all elements for the given row
   * @param rowIndex The row index from which elements will be returned
   * @returns All the elements in the given row
   */
  private getAllPiecesInRow(rowIndex: number): Piece<T>[] {
    return this.pieces.filter((element) => {
      return element.position.row === rowIndex;
    });
  }

  /**
   * Description:
   * Returns all elements for the given column
   * @param columnIndex The column index from which elements will be returned
   * @returns All the elements in the given column
   */
  private getAllPiecesInColumn(columnIndex: number): Piece<T>[] {
    return this.pieces.filter((element) => {
      return element.position.col === columnIndex;
    });
  }

  /**
   * Description:
   * Return the position of the next element based on the given direction and given piece
   * @param currentPiece the piece to compare with
   * @param direction the direction to find next piece
   * @returns the postion of the found next piece
   */
  findNextPiecePosition(
    currentPiece: Piece<T>,
    direction: CHECK_DIRECTION
  ): Position {
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

    if (direction === CHECK_DIRECTION.LEFT) {
      position.col -= 1;
    }

    if (direction === CHECK_DIRECTION.RIGHT) {
      position.col += 1;
    }
    return position;
  }

  /**
   * Description:
   * A recursive function that goes to the given direction of the given element and compares its value.
   * When values are the same it is added to the given array and the process repeats until invalid value or end of the board reached.
   * @param currentPiece the current checking piece
   * @param matchingPieces the array with all found matches until now
   * @param value the given value to compare with
   * @param checkDirection the checking process direction
   * @returns the array with all found matches
   */
  private neighourCheck(
    currentPiece: Piece<T>,
    matchingPieces: Piece<T>[],
    value: T,
    checkDirection: CHECK_DIRECTION
  ): Piece<T>[] {
    if (!currentPiece) {
      return matchingPieces;
    }
    if (currentPiece.value === value) {
      matchingPieces.push(currentPiece);
      const nextPiece = this.findPieceOnPosition(
        this.findNextPiecePosition(currentPiece, checkDirection)
      );
      this.neighourCheck(nextPiece, matchingPieces, value, checkDirection);
    }
    return matchingPieces;
  }
}
