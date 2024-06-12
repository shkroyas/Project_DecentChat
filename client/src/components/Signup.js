import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: userName, password: password })
    });

    if (response.ok) {
      alert("User registered successfully");
      navigate("/");
    } else {
      alert("Username already exists");
    }
  }

  return (
    <form className='home__container' onSubmit={handleSubmit}>
      <h2 className='home__header'>Sign up for Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input type="text"
        minLength={4}
        name="username"
        id='username'
        className='username__input'
        value={userName}
        onChange={e => setUserName(e.target.value)}
      /> <br />
      <label htmlFor="password">Password</label>
      <input type="password"
        minLength={8}
        name="password"
        id='password'
        className='password__input'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button className='home__cta'>SIGN UP</button>
    </form>
  );
}

export default Signup;
