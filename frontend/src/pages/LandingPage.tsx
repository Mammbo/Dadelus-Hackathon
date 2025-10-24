export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>LionDine AI</h1>
      <p style={{ marginBottom: '2rem' }}>Personalized dining hall recommendations</p>
      <a href="/onboarding" style={{ padding: '1rem 2rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Get Started</a>
    </div>
  );
}
