import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Home = ({ socket }) => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: userName, password: password })
    })

    if (response.ok) {
      const { token } = await response.json()
      localStorage.setItem("token", token)
      localStorage.setItem("username", userName)
      socket.emit("newUser", { userName, socketID: socket.id })
      navigate("/chat")
    } else {
      alert("Invalid credentials")
    }
  }


  return (
    <form className='home__container' onSubmit={handleSubmit}>
      <h2 className='home__header'>Sign in to Decent Chat</h2>
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
      <label htmlFor="signup">Don't have an account? <a href="/signup">Sign up</a></label>
      <br />
      Remember Me
      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
      
      <button className='home__cta'>SIGN IN</button>
      <br />
      <label htmlFor="forgot_password"><a href="/forgot_password">Forgot Password</a></label>
      <br />
    </form>
  )
}

export default Home