import React from 'react';
import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLeaveChat = () => {
    localStorage.removeItem("username");
    navigate("/");
    window.location.reload();
  };

  const handleReportMessage = (id, messageText, username, time) => {
    fetch('http://localhost:4000/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        text: messageText,
        name: username,
        time,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Report sent successfully', data);
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
    </>
  );
};

export default ChatBody;
