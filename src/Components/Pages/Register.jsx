import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/starfield-deep-space-many-light-years-far-from-earth_112293-501.jpg?semt=ais_hybrid&w=740')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>
      
      {/* Register Form */}
      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/20 shadow-[0_0_40px_rgba(8,_112,_184,_0.7)] border border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold 
            transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(79,_70,_229,_0.5)] active:scale-[0.98]
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:text-indigo-400 transition-colors duration-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
