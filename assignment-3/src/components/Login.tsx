//import {CheckButton, Form, Input} from "react-validation";

import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { login } from "../actions/auth";
import  { useState } from "react";

const required = (value: string) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = () => {

  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn } = useSelector((state: any) => state.auth);
  const { message } = useSelector((state: any) => state.message);
  
  const [invalidPassword, setInvalidPassword] = useState(true);
  const [invalidUsername, setInvalidUsername] = useState(true);

  const [successful, setSuccessful] = useState(false);

  const dispatch = useDispatch();
  

  const onChangeUsername = (e: any) => {
    validateUsername(e);
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e: any) => {
    validatePassword(e);
    const password = e.target.value;
    setPassword(password);
  };

  const validateUsername = (e: any) => {
    if(e.target.value.length < 3 || e.target.value.length > 12) {
      setInvalidUsername(true);
      return;
    }
    setInvalidUsername(false);
}

const validatePassword = (e: any) => {
  if(e.target.value.length < 3 || e.target.value.length > 12) {
    setInvalidPassword(true);
    return;
  }
  setInvalidPassword(false);
}
const handleLogin = () => {
  dispatch((login(username, password)) as any)
  .then(() => {
    navigate("/home");
    //  window.location.reload();
      setSuccessful(true);
  })
  .catch(() => {
      setSuccessful(false);
  });
};


  if (isLoggedIn) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="col-md-4 mx-auto h-100">
      <div className="card card-container p-4 my-auto">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        {(
              <div>
                <div className="form-group mt-2">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                  />
                </div>

                {invalidUsername}
  
                <div className="form-group mt-2">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                  />
                </div>

                {invalidPassword}
  
                <div className="form-group mt-4">
                  <button disabled={invalidPassword || invalidUsername} onClick={handleLogin} className="btn btn-primary btn-block w-100">Login</button>
                </div>
              </div>
            )}
  
            {message && successful && (
             <Navigate to="/" />
            )}

            {message && !successful && (
              <div className="form-group mt-4">
                <div className="alert alert-danger" role="alert">
                  <div>Incorrect username or password.</div>
                  <div>{message}</div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
};


export default Login;

