import React from "react";
import { Link } from "react-router-dom";

export default function RecommendedMeals() {
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

        <div className="data-box">
          {/* Backend data will be inserted here */}
          No data yet. Your personalized meals will appear here!
        </div>

        <Link to="/menu" className="btn-link">
          Explore Food Options 🍽️
        </Link>
      </div>
    </div>
  );
}
