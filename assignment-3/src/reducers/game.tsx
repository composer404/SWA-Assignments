/* eslint-disable import/no-anonymous-default-export */

import { BOARD_CREATED } from "../actions/types";

const initialState = {};

export default function (state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case BOARD_CREATED: 
        return {
            ...state,
            board: payload.board,
        }
    default:
      return state;
  }
}