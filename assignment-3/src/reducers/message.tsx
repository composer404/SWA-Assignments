/* eslint-disable import/no-anonymous-default-export */
import { CLEAR_MESSAGE, SET_MESSAGE } from "../actions/types";

// ! Q7 (4 - Reducer 2) - it is meant to do the management of state of the messages in the app.
// Reducer takes the result so far and the current item, then it returns the next result. 
// Need to use SET MESSAGE when the request to the API has not been completed.

const initialState = {
  message: null,
  type: null, };

export default function (state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { 
        ...state,
        message: payload.message,
        type: payload.type, 
      };

    case CLEAR_MESSAGE:
      return { 
        ...state, 
        // Spread operator takes in an iterable and expands it into individual elements.
        message: null,
        type: null, 
        // This instance is a prevention from overrting the extra values of the state.
        // The state becomes overriten.
      };

    default:
      return state;
  }
}