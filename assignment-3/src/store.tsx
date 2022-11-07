// import { applyMiddleware, combineReducers, createStore } from 'redux'

// import { composeWithDevTools } from 'redux-devtools-extension'
// import thunk from 'redux-thunk'
// import { userLoginReducer } from './reducers/userReducer'

// const reducers = combineReducers({
//   userLogin: userLoginReducer,
// })

// const userInfoFromStorage = localStorage.getItem('userInfo')
//   ? JSON.parse(localStorage.getItem('userInfo')!)
//   : undefined

// const initialState = {
//   userLogin: { userInfo: userInfoFromStorage },
// } as {}

// const middleware = [thunk]

// const store = createStore(
//   reducers,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// )

// export type RootState = ReturnType<typeof store.getState>

// export default store

import { applyMiddleware, createStore } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;