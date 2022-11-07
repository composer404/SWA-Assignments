import axios from "axios";

const API_URL = "http://localhost:9090/";

const register = (username, password) => {
  return axios.post(API_URL + "signup", {
    username,
    password,
  });
};const login = (username, password) => {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
  
        return response.data;
      });
  };
  
  const logout = () => {
    localStorage.removeItem("user");
  };
  
  export default {
    register,
    login,
    logout,
  };