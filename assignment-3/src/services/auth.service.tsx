import { useDispatch, useSelector } from "react-redux";

import { LOGIN_SUCCESS } from "../actions/types";
import axios from "axios";

const API_URL = "http://localhost:9090/";
// const dispatch = useDispatch();


const register = (username: string, password: string) => {
  return axios.post(API_URL + "users", {
    username,
    password,
  });
};

const login = async (username: string, password: string) => {
    return axios
      .post(API_URL + "login", {
        username,
        password,
      })
      .then((response: any) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  };
  

  // const login = async(username: string, password: string) =>{
  //  return axios.post(`${API_URL}/login`, username, password)
  //       .then(response => {
  //           const { token } = response.data;
  //           localStorage.setItem('token', token);
  //          dispatch({
  //              type: LOGIN_SUCCESS,
  //              payload: response.data })
  //              success();
  //           })
  //           .catch(err => {
  //               if(err) { console.log(err) }
  //           })
  //   }

  
  const logout = () => {
    localStorage.removeItem("user");
  };
  
  export default {
    register,
    login,
    logout,
  };