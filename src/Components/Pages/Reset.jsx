import React, { useState } from "react";
import { Link } from "react-router-dom";

const Reset = ({ onReset }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onReset(email);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "400px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>
        <p style={{ marginBottom: "16px", textAlign: "center" }}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #aaa", borderRadius: "4px" }}
              required
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px" }}>
            Continue
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Reset;