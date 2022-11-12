import axios from "axios";
import { getAuthHeader } from "@/utils/auth-header";

const API_URL = "http://localhost:9090/";

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

export async function register(username: string, password: string) {
  return axios.post(API_URL + "users", {
    username,
    password,
  });
}
