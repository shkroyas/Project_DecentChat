import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [usernameFound, setUsernameFound] = useState(false);

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/check_username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: userName })
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsernameFound(data.usernameFound);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/forgot_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: userName, newPassword: newPassword })
        });

        if (response.ok) {
            alert("Password reset successfully");
            navigate("/");
        } else {
            alert("Invalid username");
        }
    };

    return (
        <form className='home__container' onSubmit={usernameFound ? handlePasswordSubmit : handleUsernameSubmit}>
            <h2 className='home__header'>Reset Password</h2>
            <label htmlFor="username">Username</label>
            <input type="text"
                className='username__input'
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder='Username' required
            /> <br />

            {usernameFound && (
                <>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        className='password__input'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder='New Password' required

                    />
                </>
            )}
            <button className='home__cta' type="submit">{usernameFound ? "Reset Password" : "Check Username"}</button>

        </form>
    );
};

export default ForgotPassword;