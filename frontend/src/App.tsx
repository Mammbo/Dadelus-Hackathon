import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import ChatPage from './pages/ChatPage';
import FoodOptions from './pages/FoodOptions';
import RecommendedMeals from './pages/RecommendedMeals'; // <-- import the new page

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

        {/* User recommended meals */}
        <Route path="/recommended" element={<RecommendedMeals />} /> {/* <-- new route */}
      </Routes>
    </Router>
  );
}

export default App;
