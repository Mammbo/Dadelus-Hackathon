import React, { useState } from 'react';
import ChatBubble from './ChatBubble';

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: 'user', text: input }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: `You said: "${input}"` }]);
    }, 500);

    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#1867C0',
          color: 'white',
          fontSize: 28,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 300,
            maxHeight: 400,
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} from={msg.from} text={msg.text} />
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                outline: 'none',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '0 1rem',
                background: '#1867C0',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
