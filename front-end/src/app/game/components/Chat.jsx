'use client'
import React, { useState, useRef, useEffect } from 'react';
// import './Chat.css'; // Assume we have a CSS file for styling

function Chat() {
    const socketRef = useRef(null);
    const usernameInputRef = useRef(null);
    const messageInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8000/ws/chat_app/');

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setError(null);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket closed');
            setIsConnected(false);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Failed to connect to chat server');
            setIsConnected(false);
        };

        socketRef.current.onmessage = (event) => {
            if (event.data) {
                try {
                    const data = JSON.parse(event.data);
                    setMessages(prevMessages => [...prevMessages, {...data, timestamp: new Date()}]);
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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        const newUsername = usernameInputRef.current?.value.trim();
        if (newUsername) {
            setUsername(newUsername);
            setIsUsernameSet(true);
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: 'username',
                    username: newUsername,
                }));
            }
        }
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        const message = messageInputRef.current?.value.trim();
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && message) {
            socketRef.current.send(JSON.stringify({
                type: 'message',
                username: username,
                message: message,
            }));
            messageInputRef.current.value = ''; // Clear the input
        } else {
            setError('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="chat-container">
            {error && <div className="error-message">{error}</div>}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <span className="message-username">{message.username}</span>
                        <span className="message-content">{message.content}</span>
                        <span className="message-timestamp">
                            {message.timestamp.toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {!isUsernameSet ? (
                <form onSubmit={handleUsernameSubmit} className="username-form">
                    <input 
                        ref={usernameInputRef} 
                        type="text" 
                        placeholder="Enter your username..." 
                        required 
                    />
                    <button type="submit" disabled={!isConnected}>Set Username</button>
                </form>
            ) : (
                <form onSubmit={handleMessageSubmit} className="message-form">
                    <input 
                        ref={messageInputRef} 
                        type="text" 
                        placeholder="Enter your message..." 
                        required 
                    />
                    <button type="submit" disabled={!isConnected}>Send</button>
                </form>
            )}
            <div className="connection-status">
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
        </div>
    );
}

export default Chat;