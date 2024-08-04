'use client'
import React, { useState, useEffect, useRef } from 'react';

const WebSocketTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => { 
    socketRef.current = new WebSocket('ws://localhost:8000/ws/game/');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data.message]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        message: inputMessage
      }));
      setInputMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketTest;