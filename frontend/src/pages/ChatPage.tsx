import { useState } from 'react';

export default function ChatPage() {
  const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! What are you in the mood for today?' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const newMsg = { from: 'user', text: input };
    setMessages([...messages, newMsg]);

    // Call backend API here later
    const botReply = { from: 'bot', text: `You want ${input}? Got it!` };
    setMessages(prev => [...prev, botReply]);
    setInput('');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-4 overflow-y-auto h-[70vh]">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-xl ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-3 w-full max-w-lg">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-grow border p-2 rounded-l-xl" placeholder="Type here..." />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r-xl">Send</button>
      </div>
    </div>
  );
}
