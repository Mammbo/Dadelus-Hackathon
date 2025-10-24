import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ diet: '', goal: '', allergies: '' });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => {
    localStorage.setItem('preferences', JSON.stringify(form));
    navigate('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-semibold mb-4">Tell us about you</h2>
      <select name="diet" onChange={handleChange} className="p-2 border rounded mb-3">
        <option value="">Diet</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="none">None</option>
      </select>
      <select name="goal" onChange={handleChange} className="p-2 border rounded mb-3">
        <option value="">Goal</option>
        <option value="gain">Gain muscle</option>
        <option value="lose">Lose weight</option>
        <option value="maintain">Maintain</option>
      </select>
      <input name="allergies" placeholder="Allergies (optional)" onChange={handleChange} className="p-2 border rounded mb-3"/>
      <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white rounded">
        Continue
      </button>
    </div>
  );
}
