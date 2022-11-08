import { BOARD_CREATED } from './types'
import { CyclicGenerator } from '../utils/cyclic-generator';
import { create } from '../services/game.service'

export const createBoard = () => (dispatch: any) => {
    const generator = new CyclicGenerator('ABC')

    const board = create(generator, 4, 4);

    console.log(`game service`);
    dispatch({
        type: BOARD_CREATED,
        payload: {
            board,
        }
    })
}