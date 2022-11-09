import { ADD_SCORE, BOARD_CREATED, CLEAR_CURRENT, CLEAR_SELECTION, FIRST_ITEM_SELECTED, SECOND_ITEM_SELECTED } from './types'
import { canMove, clearCurrent, create, createGame, getGame, initalScan, move, updateGame } from '../services/game.service'

import { RandomColorGenerator } from '../utils/cyclic-generator';

export const createBoard = (userId: number, gameId: any, clear?: boolean) => (dispatch: any) => {
    const generator = new RandomColorGenerator();

    if (clear) {
        clearCurrent();
        dispatch({
            type: CLEAR_CURRENT,
        })
        gameId = undefined;
    }
    // try to load game

    if (gameId) {
        getGame(gameId).then((data) => {
            dispatch({
                type: BOARD_CREATED,
                payload: {
                    board: data.board,
                    generator,
                    firstItem: data.firstSelectedItem,
                    id: data.id,
                    score: data.score,
                }
            })
        })
        return;
    }
    // Clears all matches before save in state
    const initBoard = create(generator, 4, 4);
    const { board } = initalScan(generator, initBoard);

    //! Error handling
    createGame(userId).then((data) => {
        updateGame(data.id, {
            board,
        });
    
        dispatch({
            type: BOARD_CREATED,
            payload: {
                board,
                generator,
                score: 0,
                id: data.id
            }
        })
    });
}

export const clearCurrentGame = (gameId: number) => (dispach: any) => {
    clearCurrent();
    dispach({
        type: CLEAR_CURRENT,
    })
    // updateGame(gameId, {
    //     completed: true,
    // });

}

export const selectFirstItem = (item: any, gameId: number) => (dispach: any) => {
    updateGame(gameId, {
        firstSelectedItem: item,
    });
    dispach({
        type: FIRST_ITEM_SELECTED,
        payload: {
            firstItem: item,
        }
    })
}

export const clearSelection = (gameId: number) => (dispatch: any) => {
    updateGame(gameId, {
        firstSelectedItem: null,
    });

    dispatch({
        type: CLEAR_SELECTION,
    });
}

export const selectSecondItem = (board: any, generator: any, firstItem: any, secondItem: any, gameId: number, points: number) => (dispach: any) => {
    // Check move possiblity before save in sate
    if (!canMove(board, firstItem.position, secondItem.position)) {
        return;
    }
    const result = move(generator, board, firstItem.position, secondItem.position);

    const matches = result.effects.filter((effect) => {
        return effect.kind === `Match`;
    });

    //Dispatching points for each match
    let score = 0;
    matches.forEach(() => {
        return score += 10;
    })

    updateGame(gameId, {
        score: points + score,
        board: result.board,
        firstSelectedItem: null,
    });


    dispach({
        type: ADD_SCORE,
        payload: {
            point: score
        }
    });

    dispach({
        type: SECOND_ITEM_SELECTED,
        payload: {
            board: result.board
        }
    })
}