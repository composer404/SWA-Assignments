/* eslint-disable import/no-anonymous-default-export */

import { ADD_SCORE, BOARD_CREATED, CLEAR_SELECTION, FIRST_ITEM_SELECTED, SECOND_ITEM_SELECTED } from "../actions/types";

const initialState = {
    points: 0,
};

export default function (state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case BOARD_CREATED: 
        return {
            ...state,
            board: payload.board,
            generator: payload.generator,
            firstItem: null,
            secondItem: null,
        }
        case FIRST_ITEM_SELECTED: 
        return {
            ...state,
            firstItem: payload.firstItem,
        }
        case SECOND_ITEM_SELECTED: 
        return {
            ...state,
            board: payload.board,
            firstItem: null,
        }
        case CLEAR_SELECTION:
            return {
                ...state,
                firstItem: null,
            }
        case ADD_SCORE:
            return {
                ...state,
                points: state.points += payload.point
            }
    default:
      return state;
  }
}