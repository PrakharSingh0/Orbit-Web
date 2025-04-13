import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const onRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(4, "At least 4 characters").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "At least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await onRegister(values.email, values.password);
      } catch (error) {
        setError("Registration failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><ClipLoader color="#367fd6" size={150} speedMultiplier={0.5} /></div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "450px", border: "1px solid #ddd", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Register</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              style={{ width: "100%", padding: "10px", border: "1px solid #aaa", borderRadius: "8px", boxSizing: "border-box" }}
            />
            {formik.touched.name && formik.errors.name && <p style={{ color: "red" }}>{formik.errors.name}</p>}
          </div>

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
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;