import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { dispatchLogin } from '../../reducers/userReducer';
import "./login.css";

function Login() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const userDetails = {
      username, password
    };
    dispatch(dispatchLogin(userDetails));
    setUsername(""); setPassword("");
  };

  return (
    <div className="login-ctn">
      <div className="login-font">
        <h1>
          Log in
        </h1>

        <p>
          & keep up with what's happening
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>

        <div>
          Username 
          <input 
          type="text" 
          name="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div>
          Password 
          <input 
          type="password" 
          name="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;