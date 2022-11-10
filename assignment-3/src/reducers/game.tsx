/* eslint-disable import/no-anonymous-default-export */

import { ADD_SCORE, BOARD_CREATED, CLEAR_CURRENT, CLEAR_SELECTION, FINISH_GAME, FIRST_ITEM_SELECTED, SECOND_ITEM_SELECTED, SET_GAMES } from "../actions/types";

const gameId = JSON.parse(localStorage.getItem("currentGameId") as string);

const initialState = {
    points: 0,
    currentMove: 0,
    maxMoves: 3,
    completed: false,
    gameId,
};

export default function (state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case BOARD_CREATED: 
        return {
            ...state,
            board: payload.board,
            gameId: payload.id,
            generator: payload.generator,
            firstItem: payload.firstItem,
            currentMove: payload.currentMove || 0,
            points: payload.score,
            completed: payload.completed || false,
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
            currentMove: state.currentMove += 1,
            firstItem: null,
        }
        case FINISH_GAME:
            return {
                ...state,
                completed: true,
            }
        case SET_GAMES:
            return {
                ...state,
                games: payload.games,
            }
        case CLEAR_SELECTION:
            return {
                ...state,
                firstItem: null,
            }
        case CLEAR_CURRENT:
            return {
                ...state,
                board: null,
                gameId: null,
                generator: null,
                firstItem: null,
                points: 0,
                currentMove: 0,
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