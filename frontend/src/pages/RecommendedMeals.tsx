import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type RankedHall = {
  dining_hall: string;
  score: number;
  suggested_meals: { meal: string; calories: number }[];
};

type SummaryResponse = {
  summary: string;
  ranked_halls: RankedHall[];
};

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:8000";

export default function RecommendedMeals() {
  const [summary, setSummary] = useState<string>("");
  const [ranked, setRanked] = useState<RankedHall[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      user_profile: {
        age: 20,
        weight: 150,
        dietary_preferences: ["vegan", "gluten-free"],
        goal: "Build Muscle",
      },
      dining_halls: [
        {
          name: "John Jay",
          meals: [
            { meal: "Vegan Tofu Bowl", dietary: ["vegan", "gluten-free"] },
            { meal: "Chicken Caesar Salad", dietary: ["gluten-free"] },
          ],
        },
        {
          name: "Ferris Booth",
          meals: [
            { meal: "Grilled Salmon", dietary: ["pescatarian", "gluten-free"] },
            { meal: "Cheese Pizza", dietary: ["vegetarian"] },
          ],
        },
        {
          name: "JJ's",
          meals: [
            { meal: "Quinoa Salad", dietary: ["vegan", "gluten-free"] },
            { meal: "Beef Burger", dietary: [] },
          ],
        },
      ],
    }),
    []
  );

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setStatus("loading");
      setError(null);

      try {
        const resp = await fetch(`${BACKEND_URL}/onboarding-summary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          throw new Error(`Request failed (${resp.status})`);
        }

        const data: SummaryResponse = await resp.json();
        if (!active) return;
        setSummary(data.summary.trim());
        setRanked(data.ranked_halls || []);
        setStatus("ready");
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Unable to reach the recommendation service.");
        setStatus("error");
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [payload]);

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top left, #64C3FF, #0093FF)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        /* Floating circles animation */
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.2;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          0% { transform: translateY(100vh) translateX(0) scale(1);}
          50% { transform: translateY(50vh) translateX(20px) scale(1.2);}
          100% { transform: translateY(-20vh) translateX(-20px) scale(1);}
        }

        /* Card fade-in */
        .card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          padding: 40px 30px;
          width: 100%;
          max-width: 500px;
          text-align: center;
          animation: fadeIn 1s ease forwards;
          z-index: 1;
        }

        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #fff;
          text-shadow: 1px 1px 8px rgba(0,0,0,0.3);
        }

        .data-box {
          min-height: 200px;
          border: 2px dashed rgba(255,255,255,0.5);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 1rem;
          margin-bottom: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .data-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.3);
        }

        .btn-link {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #4FC5FF, #0093FF);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .btn-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.4);
          background: linear-gradient(135deg, #0093FF, #4FC5FF);
        }
      `}</style>

      {/* Floating circles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="floating-circle"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            background: "rgba(255, 255, 255, 0.15)",
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${15 + Math.random() * 20}s`,
          }}
        />
      ))}

      <div className="card">
        <h1>User Recommended Meals</h1>

        <div style={{ marginBottom: "1rem", fontSize: "1.2rem", color: "#fff", fontWeight: 500 }}>
          Recommended Data:
        </div>

        <div className="data-box" style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
          {status === "loading" && "Generating your personalized recommendations…"}
          {status === "error" && (
            <span style={{ color: "#ffd7d7" }}>
              {error}
              {" "}
              Ensure the backend is running at {BACKEND_URL}.
            </span>
          )}
          {status === "ready" && summary}
        </div>

        {ranked.length > 0 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(14px)",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
              maxHeight: "260px",
              overflowY: "auto",
              color: "#fff",
              textAlign: "left",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Top Dining Hall Matches</h2>
            <ol style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
              {ranked.map((hall) => (
                <li key={hall.dining_hall} style={{ marginBottom: "0.75rem" }}>
                  <strong>{hall.dining_hall}</strong> · score {hall.score.toFixed(0)}
                  <ul style={{ margin: "0.4rem 0 0 1rem" }}>
                    {hall.suggested_meals.length ? (
                      hall.suggested_meals.map((meal) => (
                        <li key={meal.meal}>
                          {meal.meal} — {meal.calories} kcal (est.)
                        </li>
                      ))
                    ) : (
                      <li>No direct matches yet — check live menus.</li>
                    )}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}

        <Link to="/menu" className="btn-link">
          Explore Food Options 🍽️
        </Link>
      </div>
    </div>
  );
}
