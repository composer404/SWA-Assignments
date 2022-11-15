import { BehaviorSubject, Observable, Subject } from 'rxjs';

import axios from "axios";
import { getAuthHeader } from "../utils/auth-header";

//import router from "@/router";

const API_URL = "http://localhost:9090/";
const isLoginSubject = new Subject();
export async function register (username: string, password: string) {
  return axios.post(API_URL + "users", {
    username,
    password,
  })
}

export function login(username: string, password: string) {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response: any) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
       // isLoginSubject.next(true);
      }
      return response.data;
    });
    
}

// export function login(username: string, password: string) {
//   return axios
//     .post(API_URL + "login", {
//       username,
//       password,
//     })
//     .then((res) => {
//       localStorage.setItem(`user`, JSON.stringify(res.data));
//     });
// }

export async function updateUser(id: number, body: any) {
  return axios
    .patch(
      API_URL + `users/${id}`,
      {
        ...body,
      },
      {
        params: {
          ...getAuthHeader(),
        },
      }
    )
    .then((response: any) => {
      return response.data;
    });
}

export async function getUser(id: number) {
  return axios
    .get(API_URL + `users/${id}`, {
      params: {
        ...getAuthHeader(),
      },
    })
    .then((response) => {
      return response.data;
    });
}

export function LoggedIn():boolean {
  // const idToken = getIdToken();
  // return !!idToken && !isTokenExpired(idToken);
  //return localStorage.getItem("user");
  // if(localStorage.getItem("user") != null)
  // {
  //   return true;
  // }
  // return false;
  return !!localStorage.getItem("user")
}

export function logout () {
  localStorage.removeItem("user");
  localStorage.removeItem("currentGameId");
 // isLoginSubject.next(false);
}

export function getLoggedInSubject() { 
  isLoginSubject.asObservable();
}

export default{
  isLoginSubject,
}
