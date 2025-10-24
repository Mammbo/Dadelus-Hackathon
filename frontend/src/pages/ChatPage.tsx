import React, { useEffect, useState } from 'react';
// Inline ChatBubble component (temporary): creates a simple styled bubble for bot/user messages
function ChatBubble({ from, text }: { from: 'bot' | 'user'; text: string }) {
  const isUser = from === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '80%',
          background: isUser ? '#1867C0' : '#f1f1f1',
          color: isUser ? 'white' : 'black',
          padding: '8px 12px',
          borderRadius: 12,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// local data to populate dropdowns; later replace fetch from backend
const diningData = [
  {
    name: 'Ferris',
    stations: [
      { name: 'Action Station', items: ['Pho Bar', 'Vegan Station', 'Stir Fry Seitan', 'Garlic Broccoli'] },
      { name: 'Pasta/Quesadilla & Rice Bowl', items: ['Paella Bar'] },
    ],
  },
  {
    name: "JJ's",
    stations: [
      { name: 'Main Line', items: ['Grilled Pineapple Hawaiian Burger', 'Vegan Chili with Fritos'] },
      { name: 'Fry Station', items: ['Onion Rings', 'Boneless Wings'] },
    ],
  },
];

export default function ChatPage() {
  const [hall, setHall] = useState('');
  const [station, setStation] = useState('');
  const [item, setItem] = useState('');
  const [stations, setStations] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi! (dev mode) select a hall/station/item or type a message. Recommendations are blank until backend provides them.' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // update stations when hall changes
    const found = diningData.find(d => d.name === hall);
    if (found) {
      setStations(found.stations.map(s => s.name));
      setStation(''); // reset downstream
      setItems([]);
      setItem('');
    } else {
      setStations([]);
      setItems([]);
      setStation('');
      setItem('');
    }
  }, [hall]);

  useEffect(() => {
    // update items when station changes
    const foundHall = diningData.find(d => d.name === hall);
    const foundStation = foundHall?.stations.find(s => s.name === station);
    if (foundStation) {
      setItems(foundStation.items);
      setItem('');
    } else {
      setItems([]);
      setItem('');
    }
  }, [station, hall]);

  const sendMessage = async () => {
    if (!input && !item) return;

    const text = input ? input : `Selected: ${hall} > ${station} > ${item}`;
    setMessages(prev => [...prev, { from: 'user', text }]);

    // Placeholder - call to your backend recommendation function goes here.
    // Example:
    // const res = await fetch('http://localhost:5000/api/recommend', { method: 'POST', body: JSON.stringify({ preferences, query: text }) })
    // const data = await res.json();
    // setMessages(prev => [...prev, { from: 'bot', text: data.reply || 'No recommendations yet.' }]);

    // For now show blank recommendation message (per requirement)
    setMessages(prev => [...prev, { from: 'bot', text: 'Recommendations area is intentionally blank until backend provides results.' }]);

    setInput('');
  };

  return (
    <div style={{ padding: 16, maxWidth: 980, margin: '0 auto' }}>
      <h2 style={{ marginTop: 8 }}>Chat & Recommendation (Dev Mode)</h2>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <select value={hall} onChange={(e) => setHall(e.target.value)} style={{ padding: 8 }}>
          <option value="">Select Hall</option>
          {diningData.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
        </select>

        <select value={station} onChange={(e) => setStation(e.target.value)} style={{ padding: 8 }}>
          <option value="">Select Station</option>
          {stations.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select>

        <select value={item} onChange={(e) => setItem(e.target.value)} style={{ padding: 8 }}>
          <option value="">Select Item</option>
          {items.map((it, i) => <option key={i} value={it}>{it}</option>)}
        </select>

        <button onClick={sendMessage} style={{ padding: '8px 12px', background: '#1867C0', color: 'white', borderRadius: 6 }}>
          Ask / Request Recommendation
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18, border: '1px solid #eee', padding: 12, borderRadius: 8, background: 'white' }}>
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from} text={m.text} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a quick question..." style={{ flex: 1, padding: 8 }} />
        <button onClick={sendMessage} style={{ padding: '8px 12px', background: '#1867C0', color: 'white', borderRadius: 6 }}>Send</button>
      </div>

      <div style={{ marginTop: 10, color: '#666', fontSize: 13 }}>
        Note: Recommendations are intentionally blank until the backend returns results. Replace the placeholder block in <code>sendMessage</code> with a call to your team's backend endpoint.
      </div>
    </div>
  );
}
