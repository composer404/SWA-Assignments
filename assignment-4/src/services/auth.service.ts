import axios from "axios";
import { getAuthHeader } from "../utils/auth-header";

//import router from "@/router";

const API_URL = "http://localhost:9090/";

export async function register (username: string, password: string) {
  return axios.post(API_URL + "users", {
    username,
    password,
  })
}

export async function login(username: string, password: string) {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response: any) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
}

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

export async function logout () {
  localStorage.removeItem("user");
  localStorage.removeItem("currentGameId");
}

export default {
  register,
  login,
  getUser,
  logout,
  updateUser,
};
