import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const onLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const onGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      setError("Google Sign-In failed. Try again.");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "At least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await onLogin(values.email, values.password);
      } catch (error) {
        setError("Login failed. Check your credentials.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><ClipLoader color="#367fd6" size={150} speedMultiplier={0.5} /></div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "450px", border: "1px solid #ddd", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Login</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              style={{ width: "100%", padding: "10px", border: "1px solid #aaa", borderRadius: "8px", boxSizing: "border-box" }}
            />
            {formik.touched.email && formik.errors.email && <p style={{ color: "red" }}>{formik.errors.email}</p>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              {...formik.getFieldProps("password")}
              style={{ width: "100%", padding: "10px", border: "1px solid #aaa", borderRadius: "8px", boxSizing: "border-box" }}
            />
            {formik.touched.password && formik.errors.password && <p style={{ color: "red" }}>{formik.errors.password}</p>}
          </div>

          <button
            type="submit"
            style={{ width: "100%", padding: "10px", border: "1px solid #aaa", borderRadius: "8px", cursor: "pointer" }}
          >
            Login
          </button>
        </form>

        <button
          onClick={onGoogleLogin}
          style={{ width: "100%", padding: "10px", border: "1px solid #aaa", borderRadius: "8px", cursor: "pointer", marginTop: "16px" }}
        >
          Sign In with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "8px" }}>
          <Link to="/reset">Reset Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;