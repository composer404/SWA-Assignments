import {
    ACCOUNT_UPDATE_FAIL,
    ACCOUNT_UPDATE_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    SET_MESSAGE,
} from "./types";

import AuthService from "../services/auth.service";

//import API_URL from '../services/auth.service';


const API_URL = "http://localhost:9090"

export const register = (username: string, password: string) => (dispatch: any) => {
    return AuthService.register(username, password).then(
      (response) => {
        dispatch({
            type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message || `Account created successfully`,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
export const login = (username: string, password: string) => (dispatch: any) => {
    return AuthService.login(username, password).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
        return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const updateUserProfile = (accountId: number) => (dispatch: any) => {
    return AuthService.getUser(accountId).then(
        (response) => {
            dispatch({
                type: ACCOUNT_UPDATE_SUCCESS,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message || `Account updated successfully`,
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: ACCOUNT_UPDATE_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
}
// export function login(username: string, password: string) {
//   return function(dispatch:any) {
//       axios.post(`${API_URL}/login`)
//           .then(response => {
//              dispatch({
//                  type: LOGIN_SUCCESS,
//                  payload: response.data
//              })
//              const { token } = response.data;
//              localStorage.setItem('token', token);
//           })
//           .catch(err => {
//               if(err) { console.log(err) }
//           })
//   }
// }
  export const logout = () => (dispatch: any) => {
    AuthService.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };