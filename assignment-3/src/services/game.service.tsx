

// export default function userService() {}

import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "http://localhost:9090/";

const getGames = () => {
    return axios.get(API_URL + "games");
  };

export default{ getGames}