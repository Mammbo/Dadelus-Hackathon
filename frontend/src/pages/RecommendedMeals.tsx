import React from 'react';

export default function RecommendedMeals() {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: '#f0f4f8',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1867C0' }}>
        User Recommended Meals
      </h1>

      <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
        Recommended Data:
      </div>

      <div
        id="backend-data-container"
        style={{
          minHeight: '200px',
          border: '2px dashed #1867C0',
          borderRadius: '12px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          fontSize: '1rem',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        {/* Backend data will be inserted here */}
      </div>
    </div>
  );
}
