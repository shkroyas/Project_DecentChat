import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const handleMessageResponse = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("messageResponse", handleMessageResponse);
    socket.on("offensiveMessageResponse", handleMessageResponse);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
      socket.off("offensiveMessageResponse", handleMessageResponse);
    };
  }, [socket]);

  useEffect(() => {
    socket.on("typingResponse", data => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
