import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function App() {
  const navigate = useNavigate(); 

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [goal, setGoal] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [diningHalls, setDiningHalls] = useState<string[]>([]);
  const [savedData, setSavedData] = useState<any>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("fitnessData");
    if (stored) {
      const data = JSON.parse(stored);
      setSavedData(data);
      setAge(data.age || "");
      setWeight(data.weight || "");
      setSex(data.sex || "");
      setGoal(data.goal || "");
      setPreferences(data.preferences || []);
      setDiningHalls(data.diningHalls || []);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < steps.length - 1) {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [step, age, weight, sex, goal, preferences, diningHalls]);

  const handlePreferenceChange = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleDiningChange = (hall: string) => {
    setDiningHalls((prev) =>
      prev.includes(hall) ? prev.filter((h) => h !== hall) : [...prev, hall]
    );
  };

  const handleNext = () => {
    if (step === 0 && !age) return alert("Please enter your age");
    if (step === 1 && !weight) return alert("Please enter your weight");
    if (step === 2 && !sex) return alert("Please select your sex");
    if (step === 3 && !goal) return alert("Please select your goal");
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    const data = {
      age,
      weight,
      sex,
      goal,
      preferences,
      diningHalls,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("fitnessData", JSON.stringify(data));
    setSavedData(data);
    alert("Data saved successfully!");

    navigate("/food-options");
  };

  const handleClear = () => {
    localStorage.removeItem("fitnessData");
    setAge("");
    setWeight("");
    setSex("");
    setGoal("");
    setPreferences([]);
    setDiningHalls([]);
    setSavedData(null);
    setStep(0);
    alert("Data cleared!");
  };

  const steps = [
    {
      title: "Your Age",
      content: (
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.input}
          placeholder="Enter your age"
        />
      ),
    },
    {
      title: "Your Weight (lbs)",
      content: (
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={styles.input}
          placeholder="Enter your weight"
        />
      ),
    },
    {
      title: "Sex",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {["male", "female"].map((option) => (
            <label
              key={option}
              style={{
                ...styles.optionBox,
                borderColor: sex === option ? "#667eea" : "#ccc",
                background: sex === option ? "rgba(102,126,234,0.1)" : "white",
              }}
            >
              <input
                type="radio"
                name="sex"
                value={option}
                checked={sex === option}
                onChange={(e) => setSex(e.target.value)}
              />
              <span
                style={{
                  marginLeft: 8,
                  fontWeight: sex === option ? 600 : 400,
                  color: sex === option ? "#333" : "#555",
                  textTransform: "capitalize",
                }}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Goal",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {["maintain", "lose", "build"].map((option) => (
            <label
              key={option}
              style={{
                ...styles.optionBox,
                borderColor: goal === option ? "#667eea" : "#ccc",
                background: goal === option ? "rgba(102,126,234,0.1)" : "white",
              }}
            >
              <input
                type="radio"
                name="goal"
                value={option}
                checked={goal === option}
                onChange={(e) => setGoal(e.target.value)}
              />
              <span
                style={{
                  marginLeft: 8,
                  fontWeight: goal === option ? 600 : 400,
                  color: goal === option ? "#333" : "#555",
                  textTransform: "capitalize",
                }}
              >
                {option === "build"
                  ? "Build Muscle"
                  : option === "lose"
                  ? "Lose Weight"
                  : "Maintain Calories"}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Dietary Preferences",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {["vegan", "kosher", "halal", "gluten free"].map((pref) => {
            const selected = preferences.includes(pref);
            return (
              <label
                key={pref}
                style={{
                  ...styles.optionBox,
                  borderColor: selected ? "#667eea" : "#ccc",
                  background: selected ? "rgba(102,126,234,0.1)" : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handlePreferenceChange(pref)}
                />
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: selected ? 600 : 400,
                    color: selected ? "#333" : "#555",
                    textTransform: "capitalize",
                  }}
                >
                  {pref}
                </span>
              </label>
            );
          })}
        </div>
      ),
    },
    {
      title: "Select Preferred Dining Halls",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {["Ferris", "JJ's", "Chef Mike's", "Chef Don's"].map((hall) => {
            const selected = diningHalls.includes(hall);
            return (
              <label
                key={hall}
                style={{
                  ...styles.optionBox,
                  borderColor: selected ? "#667eea" : "#ccc",
                  background: selected ? "rgba(102,126,234,0.1)" : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleDiningChange(hall)}
                />
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: selected ? 600 : 400,
                    color: selected ? "#333" : "#555",
                    textTransform: "capitalize",
                  }}
                >
                  {hall}
                </span>
              </label>
            );
          })}
        </div>
      ),
    },
    {
      title: "Review Your Data",
      content: (
        <div style={{ lineHeight: "1.8" }}>
          <p>
            <strong>Age:</strong> {age}
          </p>
          <p>
            <strong>Sex:</strong>{" "}
            {sex ? sex.charAt(0).toUpperCase() + sex.slice(1) : ""}
          </p>
          <p>
            <strong>Weight:</strong> {weight} lbs
          </p>
          <p>
            <strong>Goal:</strong>{" "}
            {goal
              ? goal === "maintain"
                ? "Maintain Calories"
                : goal === "lose"
                ? "Lose Weight"
                : "Build Muscle"
              : ""}
          </p>
          <p>
            <strong>Dietary Preferences:</strong>{" "}
            {preferences.length > 0
              ? preferences
                  .map((pref) => pref.charAt(0).toUpperCase() + pref.slice(1))
                  .join(", ")
              : "None"}
          </p>
          <p>
            <strong>Preferred Dining Halls:</strong>{" "}
            {diningHalls.join(", ") || "None"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.background}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={styles.card}>
        {savedData && (
          <button onClick={handleClear} style={styles.clearBtn}>
            ✖
          </button>
        )}

        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
          <h2 style={styles.title}>{steps[step].title}</h2>
          <div>{steps[step].content}</div>

          <div style={styles.buttonRow}>
            {step > 0 ? (
              <button onClick={handleBack} style={styles.backBtn}>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button onClick={handleNext} style={styles.nextBtn}>
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} style={styles.saveBtn}>
                Save
              </button>
            )}
          </div>

          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  background: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6CC1FF 0%, #3A8DFF 100%)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    transition: "all 0.3s ease",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#333",
    marginBottom: "24px",
    textAlign: "center",
    letterSpacing: "-0.3px",
  },
  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1.5px solid #ccc",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
  optionBox: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #ccc",
    borderRadius: "10px",
    padding: "12px 14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "white",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "32px",
  },
  backBtn: {
    background: "#e0e0e0",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    transition: "background 0.2s",
  },
  nextBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    transition: "opacity 0.2s",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #00b09b, #96c93d)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
  },
  clearBtn: {
    position: "absolute",
    top: "14px",
    right: "18px",
    background: "none",
    border: "none",
    color: "#999",
    fontSize: "18px",
    cursor: "pointer",
  },
  progressContainer: {
    height: "8px",
    background: "#eee",
    borderRadius: "4px",
    marginTop: "28px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
};
