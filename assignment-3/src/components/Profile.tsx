import {Navigate, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUserProfile} from "../actions/auth";

const Profile = () => {

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUpdated } = useSelector((state: any) => state.auth);
  const { message } = useSelector((state: any) => state.message);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [invalidPassword, setInvalidPassword] = useState(true);
  const [invalidUsername, setInvalidUsername] = useState(true);

  const [successful] = useState(false);

  useEffect(() => {
    dispatch(updateUserProfile(isUpdated) as any);
  });

  const onChangeUsername = (e: any) => {
    validateUsername(e);
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e: any) => {
    validatePassword(e)
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

  if (isUpdated) {
    return <Navigate to="/game" />;
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
                  <button disabled={invalidPassword || invalidUsername} className="btn btn-primary btn-block w-100">Save</button>
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

export default Profile;