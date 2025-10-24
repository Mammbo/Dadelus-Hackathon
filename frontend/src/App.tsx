import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import ChatPage from './pages/ChatPage';
import FoodOptions from './pages/FoodOptions';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing/Home page */}
        <Route path="/" element={<LandingPage />} />

        {/* User onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Chatbot page */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Dining menu page */}
        <Route path="/menu" element={<FoodOptions />} />
      </Routes>
    </Router>
  );
}

export default App;
