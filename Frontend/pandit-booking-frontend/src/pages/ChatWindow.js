import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Use your deployed backend URL here to connect Socket.IO
const BACKEND_URL = 'http://localhost:5000';

// Create Socket.IO client instance
const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

function ChatWindow({ userId, panditId, onClose, chatName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const roomId = `${userId}_${panditId}`; // Ensures same room on both sides
  const messagesEndRef = useRef(null);

  // Track sent messages to avoid duplicates
  const sentMessageIds = useRef(new Set());

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (msg) => {
      const msgId = `${msg.timestamp}_${msg.senderId}`;
      if (sentMessageIds.current.has(msgId)) {
        return; // Ignore duplicate message
      }
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
      sentMessageIds.current.clear();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msgObj = {
      roomId,
      senderId: userId,
      message: input,
      timestamp: Date.now(),
    };

    sentMessageIds.current.add(`${msgObj.timestamp}_${msgObj.senderId}`);

    setMessages(prev => [...prev, msgObj]);
    socket.emit('sendMessage', msgObj);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 0, width: 350, height: 400,
      border: '1px solid #ccc', backgroundColor: 'white', display: 'flex',
      flexDirection: 'column', boxShadow: '0 0 10px rgba(0,0,0,0.3)', zIndex: 9999
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <strong>Chat with {chatName}</strong>
        <button
          onClick={onClose}
          style={{ float: 'right', border: 'none', background: 'transparent', cursor: 'pointer' }}
          aria-label="Close chat"
        >
          ✖
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10, fontSize: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: msg.senderId === userId ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#EEE',
              padding: '6px 12px',
              borderRadius: 20,
              maxWidth: '80%',
              wordWrap: 'break-word',
            }}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 10, borderTop: '1px solid #ddd', display: 'flex' }}>
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
          style={{ flex: 1, marginRight: 5, padding: 8 }}
          aria-label="Message input"
        />
        <button onClick={sendMessage} aria-label="Send message">Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;