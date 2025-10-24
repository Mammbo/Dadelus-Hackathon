import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import ChatPage from './pages/ChatPage';
import FoodOptions from './pages/FoodOptions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/menu" element={<FoodOptions />} />
      </Routes>
    </Router>
  );
}

export default App;
