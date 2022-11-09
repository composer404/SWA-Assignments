import { ADD_SCORE, BOARD_CREATED, CLEAR_SELECTION, FIRST_ITEM_SELECTED, SECOND_ITEM_SELECTED } from './types'
import { canMove, create, initalScan, move } from '../services/game.service'

import { RandomColorGenerator } from '../utils/cyclic-generator';

export const createBoard = () => (dispatch: any) => {
    const generator = new RandomColorGenerator();

    // Clears all matches before save in state
    const initBoard = create(generator, 4, 4);
    const { board } = initalScan(generator, initBoard);

    dispatch({
        type: BOARD_CREATED,
        payload: {
            board,
            generator,
        }
    })
}

export const selectFirstItem = (item: any) => (dispach: any) => {
    dispach({
        type: FIRST_ITEM_SELECTED,
        payload: {
            firstItem: item,
        }
    })
}

export const clearSelection = () => (dispatch: any) => {
    dispatch({
        type: CLEAR_SELECTION,
    });
}

export const selectSecondItem = (board: any, generator: any, firstItem: any, secondItem: any) => (dispach: any) => {
    // Check move possiblity before save in sate
    if (!canMove(board, firstItem.position, secondItem.position)) {
        return;
    }
    const result = move(generator, board, firstItem.position, secondItem.position);

    const matches = result.effects.filter((effect) => {
        return effect.kind === `Match`;
    });

    //Dispatching points for each match
    matches.map(() => {
        return dispach({
            type: ADD_SCORE,
            payload: {
                point: 10
            }
        });
    })

    dispach({
        type: SECOND_ITEM_SELECTED,
        payload: {
            board: result.board
        }
    })
}