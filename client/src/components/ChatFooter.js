// ChatFooter.js

import React, { useState } from 'react';
import checkPageStatus from "../utils/functions";
import Popup from './Popup';

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [isOffensive, setIsOffensive] = useState(false);
  const [censoredMessage, setCensoredMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleTyping = () => socket.emit("typing", `${localStorage.getItem("userName")} is typing`);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const currentTime = new Date().toString();
    const userName = localStorage.getItem("username");

    if (!message.trim() || !userName) return; // Don't send empty messages or if user is not set

    try {
      const response = await fetch('http://localhost:5000/evaluate_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setIsOffensive(data.offensive);
      setCensoredMessage(data.censored_text);
      if (data.offensive) {
        setIsOpen(true); // Set isOpen to true if message is offensive
        return; // Don't proceed further for offensive message
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }

    sendMessage(isOffensive ? censoredMessage : message, userName, currentTime, isOffensive);
  };

  const sendMessage = (message, userName, currentTime, isOffensive) => {
    socket.emit("message", {
      text: message,
      name: userName,
      id: `${socket.id}${Math.random()}`,
      time: currentTime,
      offensive: isOffensive
    });

    checkPageStatus(message, userName);
    setMessage("");
    setIsOffensive(false); // Reset offensive status after sending
  };

  const handleConfirmSend = () => {
    setIsOpen(false);
    sendMessage(censoredMessage, localStorage.getItem("username"), new Date().toString(), true);
  };

  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder='Write message'
          className='message'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
        <Popup isOpen={isOpen} setIsOpen={setIsOpen} onConfirmSend={handleConfirmSend} />
      </form>
    </div>
  );
};

export default ChatFooter;