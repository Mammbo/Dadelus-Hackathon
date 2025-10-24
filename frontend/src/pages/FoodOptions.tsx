import React, { useState, useEffect } from 'react';

const diningData = {
  Breakfast: [
    {
      name: 'Ferris Booth Commons',
      hours: '7:00 AM - 11:00 AM',
      stations: [
        { name: 'Action Station', icon: '🍲', items: ['Oatmeal', 'Scrambled Eggs', 'Vegan Pancakes'] },
        { name: 'Fruit Bar', icon: '🍎', items: ['Cantaloupe', 'Watermelon', 'Pineapple'] },
      ],
    },
    {
      name: "JJ's Place",
      hours: '7:30 AM - 11:30 AM',
      stations: [
        { name: 'Main Line', icon: '🥪', items: ['Egg Sandwich', 'Bagels with Cream Cheese', 'Breakfast Burrito'] },
        { name: 'Grill', icon: '🍳', items: ['Bacon', 'Sausage', 'Hash Browns'] },
      ],
    },
    {
      name: 'Chef Mike\'s Sub Shop',
      hours: '10:30 AM - 10:00 PM',
      stations: [
        { name: 'Build Your Own - Right Line', icon: '🥪', items: ['Various Bread Options', 'Cold Cuts', 'Cheeses', 'Toppings'] },
        { name: 'Hot Counter - Left Line', icon: '🌶️', items: ['Hot Chicken Sub', 'Mike\'s Hot Honey'] },
      ],
    },
    {
      name: 'Chef Don\'s Pizza Pi',
      hours: '11:00 AM - 6:00 PM',
      stations: [
        { name: 'Entree', icon: '🍕', items: ['Build Your Own Pizza', 'Toasted Cuban Sandwich'] },
        { name: 'Sides', icon: '🍟', items: ['Piece of Fruit', 'Soup', 'Milkshake'] },
      ],
    },
  ],
  Lunch: [
    {
      name: 'Ferris Booth Commons',
      hours: '11:00 AM - 3:00 PM',
      stations: [
        { name: 'Main Line', icon: '🥩', items: ['Grilled Chicken', 'Vegan Chili', 'Paella'] },
        { name: 'Fry Station', icon: '🍟', items: ['French Fries', 'Onion Rings'] },
      ],
    },
    {
      name: "JJ's Place",
      hours: '12:00 PM - 2:30 PM',
      stations: [
        { name: 'Main Line', icon: '🥪', items: ['Turkey Burger with Sesame Glaze', 'Chicken Parm Sandwich', 'Fish and Chips'] },
        { name: 'Fry Station', icon: '🍟', items: ['Dino Nuggets', 'Sweet Potato Fries', 'Steak Fries'] },
        { name: 'Grill', icon: '🍔', items: ['BBQ Chicken Quesadilla'] },
      ],
    },
    {
      name: 'Chef Mike\'s Sub Shop',
      hours: '10:30 AM - 10:00 PM',
      stations: [
        { name: 'Build Your Own - Right Line', icon: '🥪', items: ['Various Bread Options', 'Cold Cuts', 'Cheeses', 'Toppings'] },
        { name: 'Hot Counter - Left Line', icon: '🌶️', items: ['Hot Chicken Sub', 'Mike\'s Hot Honey'] },
      ],
    },
    {
      name: 'Chef Don\'s Pizza Pi',
      hours: '11:00 AM - 6:00 PM',
      stations: [
        { name: 'Entree', icon: '🍕', items: ['Build Your Own Pizza', 'Toasted Cuban Sandwich'] },
        { name: 'Sides', icon: '🍟', items: ['Piece of Fruit', 'Soup', 'Milkshake'] },
      ],
    },
  ],
  Dinner: [
    {
      name: 'Ferris Booth Commons',
      hours: '5:00 PM - 8:00 PM',
      stations: [
        { name: 'Main Line', icon: '🥩', items: ['Chicken Parm', 'Four Cheese Baked Ziti', 'Garlic Bread', 'Navy Beans', 'Ratatouille'] },
        { name: 'Vegan Station', icon: '🥦', items: ['Vegan Chicken Parm', 'Orecchiette with Sundried Tomatoes and Broccoli Rabe', 'Ratatouille'] },
        { name: 'Action Station', icon: '🍛', items: ['Chicken Tikka Masala', 'Naan Bread', 'White Rice'] },
        { name: 'Pasta, Quesadilla & Rice Bowl Station', icon: '🍝', items: ['Quesadilla', 'Pasta', 'Rice Bowl'] },
      ],
    },
    {
      name: "JJ's Place",
      hours: '5:00 PM - 11:00 PM',
      stations: [
        { name: 'Main Line', icon: '🥪', items: ['Turkey Burger with Sesame Glaze', 'Chicken Parm Sandwich', 'Fish and Chips'] },
        { name: 'Fry Station', icon: '🍟', items: ['Dino Nuggets', 'Sweet Potato Fries', 'Steak Fries'] },
        { name: 'Grill', icon: '🍔', items: ['BBQ Chicken Quesadilla'] },
      ],
    },
    {
      name: 'Chef Mike\'s Sub Shop',
      hours: '10:30 AM - 10:00 PM',
      stations: [
        { name: 'Build Your Own - Right Line', icon: '🥪', items: ['Various Bread Options', 'Cold Cuts', 'Cheeses', 'Toppings'] },
        { name: 'Hot Counter - Left Line', icon: '🌶️', items: ['Hot Chicken Sub', 'Mike\'s Hot Honey'] },
      ],
    },
    {
      name: 'Chef Don\'s Pizza Pi',
      hours: '11:00 AM - 6:00 PM',
      stations: [
        { name: 'Entree', icon: '🍕', items: ['Build Your Own Pizza', 'Toasted Cuban Sandwich'] },
        { name: 'Sides', icon: '🍟', items: ['Piece of Fruit', 'Soup', 'Milkshake'] },
      ],
    },
  ],
};

export default function FoodOptions() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [activeMeal, setActiveMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Lunch');
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setActiveMeal('Breakfast');
    else if (hour < 17) setActiveMeal('Lunch');
    else setActiveMeal('Dinner');
  }, []);

  const toggleStation = (hallName: string, stationName: string) => {
    const key = hallName + stationName;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const backgroundStyle = nightMode
    ? { background: '#0b0c2a', color: '#fff' }
    : { background: '#FFFAF0', color: '#333' };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'sans-serif', ...backgroundStyle, transition: 'all 0.5s ease' }}>
      {nightMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                background: 'white',
                borderRadius: '50%',
                animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: nightMode ? '#8ab4f8' : '#1867C0' }}>LionDine AI 🍴</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div>{dateStr}</div>
            <div>{nightMode ? '🌙 60°F' : '☀️ 72°F'}</div>
          </div>
          <button
            onClick={() => setNightMode(!nightMode)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: nightMode ? '#8ab4f8' : '#1867C0',
              color: '#fff',
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
          >
            {nightMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {(['Breakfast', 'Lunch', 'Dinner'] as const).map((meal) => (
          <button
            key={meal}
            onClick={() => setActiveMeal(meal)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeMeal === meal ? (nightMode ? '#8ab4f8' : '#1867C0') : nightMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
              color: activeMeal === meal ? '#fff' : nightMode ? '#fff' : '#333',
              transition: 'all 0.2s ease',
            }}
          >
            {meal}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {diningData[activeMeal].map((hall, i) => (
          <div
            key={i}
            style={{
              background: nightMode ? 'rgba(10,10,30,0.85)' : 'rgba(255,255,255,0.85)',
              borderRadius: 16,
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              padding: '1rem 1.2rem',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.15)';
            }}
          >
            <header style={{ marginBottom: '0.8rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: nightMode ? '#8ab4f8' : '#1867C0' }}>{hall.name}</h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: nightMode ? '#ccc' : '#555' }}>{hall.hours}</p>
            </header>

            {hall.stations.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {hall.stations.map((station, j) => {
                  const key = hall.name + station.name;
                  return (
                    <div key={j}>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          margin: '0.4rem 0',
                          color: nightMode ? '#fff' : '#333',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleStation(hall.name, station.name)}
                      >
                        {station.icon} {station.name} {expanded[key] ? '▲' : '▼'}
                      </h3>
                      {expanded[key] && (
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', listStyleType: 'disc', color: nightMode ? '#ddd' : '#444', transition: 'all 0.25s ease' }}>
                          {station.items.map((item, k) => (
                            <li key={k} style={{ marginBottom: 2 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: nightMode ? '#888' : '#888', fontStyle: 'italic', marginTop: 8 }}>Closed / no stations listed.</p>
            )}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8);}
            50% { opacity: 1; transform: scale(1.2);}
            100% { opacity: 0.2; transform: scale(0.8);}
          }
        `}
      </style>
    </div>
  );
}
