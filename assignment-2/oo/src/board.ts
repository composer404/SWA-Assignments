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

  /* ----------------------------- GIVEN FUNCTIONS ---------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                          MOVING AND REFILING PART                          */
  /* -------------------------------------------------------------------------- */

  /* ---------------------- COLUMN MATCHES WITH RECURSTION -------------------- */

  /**
   * Searchs for matches in all rows of the board.
   * @returns the array with all found matches
   */
  private getAllColumnMatches() {
    let matches: Piece<T>[] = [];
    for (let i = this.width; i >= 0; i--) {
      const elementsInColumn = this.getAllPiecesInColumn(i);
      for (const element of elementsInColumn) {
        if (!matches.includes(element)) {
          matches = matches.concat(this.columnDeepNeighbourCheck(element));
        }
      }
    }
    return matches;
  }

  /**
   * Searches for matches on the top and bottom of the given element. And fires event when enabled.
   * @param startPiece the given start element
   * @returns the empty array or array with all matched elements
   */
  private columnDeepNeighbourCheck(startPiece: Piece<T>) {
    const nextTopPosition = this.findNextPiecePosition(
      startPiece,
      CHECK_DIRECTION.TOP
    );
    const pieceOnNextTopPosition = this.findPieceOnPosition(nextTopPosition);
    const topElements = this.neighourCheck(
      pieceOnNextTopPosition,
      [],
      startPiece.value,
      CHECK_DIRECTION.TOP
    );
    const downElements = this.neighourCheck(
      this.findPieceOnPosition(
        this.findNextPiecePosition(startPiece, CHECK_DIRECTION.DOWN)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.DOWN
    );

    if (topElements.length + downElements.length + 1 >= 3) {
      const matchedPieces = [...topElements, startPiece, ...downElements];
      if (this.eventsEnabled) {
        this.callMatchListeners(matchedPieces);
      }
      return matchedPieces;
    }

    return [];
  }

  private callMatchListeners(matchedPieces: Piece<T>[]) {
    this.listeners.forEach((listener) => {
      listener({
        kind: `Match`,
        match: {
          matched: { ...matchedPieces[0] }.value,
          positions: matchedPieces.map((match) => match.position),
        },
      });
    });
  }

  /* ----------------------- ROW MATCHES WITH RECURSTION ---------------------- */

  /**
   * Searchs for matches in all rows of the board.
   * @returns the array with all found matches
   */
  private getAllRowMatches() {
    let matches: Piece<T>[] = [];
    for (let i = 0; i < this.height; i++) {
      const elementsInRow = this.getAllPiecesInRow(i);
      for (const element of elementsInRow) {
        if (!matches.includes(element)) {
          matches = matches.concat(this.rowDeepNeighbourCheck(element));
        }
      }
    }
    return matches;
  }

  /**
   * Searches for matches on the left and right of the given element. And fires event when enabled.
   * @param startPiece the given start element
   * @returns the empty array or array with all matched elements
   */
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
        startPiece,
        ...rightSideElements,
      ];

      if (this.eventsEnabled) {
        this.callMatchListeners(matchedPieces);
      }
      return matchedPieces;
    }

    return [];
  }

  /**
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

    // Recursive scan to see if new matches occured
    this.scanBoard();
  }

  /**
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

  /**
   * Checks is the given postion is outside of the generated board
   * @param p the given position
   * @returns boolean value based on the check state
   */
  private isPositionOutsideBoard(p: Position): boolean {
    if (p.col >= this.width || p.col < 0) {
      return false;
    }

    if (p.row >= this.height || p.row < 0) {
      return false;
    }
    return true;
  }

  /**
   * Searches for the element of the given position
   * @param position the given element position
   * @returns the element or undefined
   */
  private findPieceOnPosition(position: Position): Piece<T> {
    return this.pieces.find((element) => {
      return (
        element.position.col == position.col &&
        element.position.row == position.row
      );
    });
  }

  /**
   * Fills the board with inital values given by the generator
   */
  private initBoardFill(): void {
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

    // Monkey patched function to pieces object
    (this.pieces as any).swapProperties = (
      firstIndex: number,
      secondIndex: number,
      propertyToSwap: string
    ) => {
      const firstPieceValue = this.pieces[firstIndex][propertyToSwap];
      const secondPieceValue = this.pieces[secondIndex][propertyToSwap];
      this.pieces[firstIndex][propertyToSwap] = secondPieceValue;
      this.pieces[secondIndex][propertyToSwap] = firstPieceValue;
    };
  }

  /**
   * Scans the board to find all matches, removes them and calls a recursive refill function
   */
  private scanBoard() {
    const allRowMatches = this.getAllRowMatches();
    const allColumnMatches = this.getAllColumnMatches();
    if (allColumnMatches.length || allRowMatches.length) {
      this.removedMatchedValues(allRowMatches, allColumnMatches);
      this.refillBoard();
    }
  }

  /**
   * Finds elements on given position and swaps their values based on the fuction patched to pieces array
   * @param first position of the first element
   * @param second position of th second element
   */
  private swapPieces(first: Position, second: Position) {
    const firstPiece = this.findPieceOnPosition(first);
    const secondPiece = this.findPieceOnPosition(second);

    const firstIndex = this.pieces.indexOf(firstPiece);
    const secondIndex = this.pieces.indexOf(secondPiece);

    (this.pieces as any).swapProperties(firstIndex, secondIndex, `value`);
  }

  /**
   * Checks if move is legal according to the game rules
   * @param firstPosition the postion of the first element
   * @param secondPosition the position of the second element
   * @returns boolean value based on the move legal state
   */
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
}
