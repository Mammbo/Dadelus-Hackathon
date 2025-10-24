import { useState, useEffect } from 'react';

export default function App() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [goal, setGoal] = useState('');
  const [savedData, setSavedData] = useState<any>(null);

  // Load saved data when component mounts
  useEffect(() => {
    const stored = localStorage.getItem('fitnessData');
    if (stored) {
      const data = JSON.parse(stored);
      setSavedData(data);
      setAge(data.age);
      setWeight(data.weight);
      setSex(data.sex);
      setGoal(data.goal);
    }
  }, []);

  const handleSubmit = () => {
    if (!age || !weight || !sex || !goal) {
      alert('Please fill in all fields');
      return;
    }

    const data = { age, weight, sex, goal, savedAt: new Date().toISOString() };
    
    // Save to localStorage
    localStorage.setItem('fitnessData', JSON.stringify(data));
    setSavedData(data);
    
    alert('Data saved successfully!');
  };

  const handleClear = () => {
    localStorage.removeItem('fitnessData');
    setAge('');
    setWeight('');
    setSex('');
    setGoal('');
    setSavedData(null);
    alert('Data cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Some information about you</h1>
        <p className="text-gray-600 mb-6">Let's calculate your personalized plan</p>
        
        {savedData && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">✓ Data saved locally</p>
            <p className="text-xs text-green-600 mt-1">
              Last updated: {new Date(savedData.savedAt).toLocaleString()}
            </p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sex
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Goal
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="goal"
                  value="maintain"
                  checked={goal === 'maintain'}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700">Maintain Calories</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="goal"
                  value="lose"
                  checked={goal === 'lose'}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700">Lose Weight</span>
              </label>
              
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="goal"
                  value="build"
                  checked={goal === 'build'}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700">Build Muscle</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              Save and Proceed
            </button>
            
            {savedData && (
              <button
                onClick={handleClear}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}