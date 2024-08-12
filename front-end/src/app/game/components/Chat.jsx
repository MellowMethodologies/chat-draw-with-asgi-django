'use client'
import React, { useState, useRef, useEffect } from 'react';

function Chat() {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8000/ws/chat_app/');

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket closed');
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socketRef.current.onmessage = (event) => {
            if (event.data) {
                try {
                    console.log(event.data);
                    const data = JSON.parse(event.data);
                    setMessages(prevMessages => [...prevMessages, data]);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            } else {
                console.warn('Received empty WebSocket message');
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements[0];
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'message',
                message: input.value,
            }));
            input.value = '';
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div className="container">
            <div className="chat">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <span className="message-username">{message.username}</span>
                        <span className="message-content">{message.content}</span>
                    </div>
                ))}
            </div>
            <form className="chat-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter your message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;