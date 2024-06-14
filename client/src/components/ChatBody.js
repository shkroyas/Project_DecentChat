// ChatBody.js

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  
  const [isOpen, setIsOpen] = useState(false);
  const [reportMessageId, setReportMessageId] = useState(null); // State to store the reported message ID

  const handleLeaveChat = () => {
    localStorage.removeItem("username");
    navigate("/");
    window.location.reload();
  };

  const handleReportMessage = (id, messageText, username, time) => {
    setReportMessageId(id); // Set the reported message ID
    setIsOpen(true); // Open the report confirmation popup
  };

  const handleConfirmReport = () => {
    // Logic to handle confirmation of reporting
    console.log("Confirming report for message:", reportMessageId);
    
    fetch('http://localhost:4000/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reportMessageId,
        text: messages.find(message => message.id === reportMessageId).text, // Get the text of the reported message
        name: username,
        time: messages.find(message => message.id === reportMessageId).time // Get the time of the reported message
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Report sent successfully', data);
        setIsOpen(false); // Close the report confirmation popup after successful report
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <header className='chat__mainHeader'>
        <p>Hangout with Colleagues</p>
        <button className='leaveChat__btn' onClick={handleLeaveChat}>LEAVE CHAT</button>
      </header>

      <div className='message__container'>
        {messages.map(message => {
          const isSender = message.name === username;
          return (
            <div
              className={`message__chats ${isSender ? 'sender' : 'recipient'}`}
              key={message.id}
            >
              <p className={isSender ? 'sender__name' : 'recipient__name'}>
                {isSender ? 'You' : message.name}
              </p>
              <div className={`message__box ${isSender ? 'message__sender' : 'message__recipient'}`}>
                <p>{message.text}</p>
                <p className='message__timestamp'>{formatTime(message.time)}</p>
                {!isSender && message.offensive && (
                  <button className="report__btn" onClick={() => handleReportMessage(message.id, message.text, message.name, message.time)}>Report</button>
                )}
              </div>
            </div>
          );
        })}
        <div className='message__status'>
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>

      {/* Report Confirmation Popup */}
      {isOpen && (
        <div className="popup-container">
          <div className="popup">
            <p>Are you sure you want to report this message?</p>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={handleConfirmReport}>Report</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBody;