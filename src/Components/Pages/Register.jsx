import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = ({ onRegister, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required").min(4, "At least 4 characters"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required").min(6, "At least 6 characters"),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    onRegister(values.name, values.email, values.password).finally(() => setLoading(false));
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit: handleSubmit });

  return loading ? (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>
  ) : (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "400px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #aaa", borderRadius: "4px" }}
            />
            {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #aaa", borderRadius: "4px" }}
            />
            {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              {...formik.getFieldProps("password")}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #aaa", borderRadius: "4px" }}
            />
            {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
          </div>

          <button type="submit" style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px" }}>Register</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
