export default function LandingPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #6CC1FF 0%, #3A8DFF 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '700', textShadow: '2px 2px rgba(0,0,0,0.15)' }}>
        LionDine AI
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '650px' }}>
        Get personalized dining hall recommendations tailored to your diet, fitness goals, and preferences.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <a
          href="/chat"
          style={{
            padding: '0.9rem 1.6rem',
            backgroundColor: 'white',
            color: '#1867C0',
            fontWeight: 700,
            textDecoration: 'none',
            borderRadius: '10px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
          }}
        >
          Start Chatting
        </a>

        <a
          href="/menu"
          style={{
            padding: '0.9rem 1.6rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          View Menu
        </a>
      </div>

      <small style={{ marginTop: '1.25rem', opacity: 0.9 }}>
        (For dev: Start Chatting bypasses onboarding so you can test the chatbot and menu.)
      </small>
    </div>
  );
}
