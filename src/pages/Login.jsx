import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Container, Row, Col, Card } from "react-bootstrap";
import logo from "../../src/assets/logo1.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Email address is invalid";

    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    return newErrors;
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      for (const [key, message] of Object.entries(validationErrors)) {
        toast.error(message);
      }
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "https://backend-bora.onrender.com/user/login",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = response.data;

      if (!responseData.ok) {
        toast.error(responseData.message || "Login Failed");
      } else {
        if (responseData.data) {
          dispatch(setUser(responseData.data));
          toast.success(
            responseData.message || "Login Successful, Welcome To Bora"
          );
          navigate("/dashboard");
        } else {
          toast.error("Unexpected error: User data not found");
        }
      }
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message || "An unexpected error occurred"
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="p-6 py-6 "
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: "6rem",
        }}
    >
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={12} className="d-flex justify-content-center">
          <Card
            className=""
            className=""
            style={{
              padding: "5%",
              width: "300px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            </div>
            <h1 className="text-center">Welcome back</h1>
            <p
              className="text-center fw-bold fs-6"
              style={{
                color: "GrayText",
              }}
            >
              Glad to see you again👋
              <br />
              Login to your account below
            </p>

            <form onSubmit={loginUser}>
              {/* Email input */}
              <div>
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  style={{
                    background: "#f9f9f",
                    border: "1px solid #000000",
                    color: "black",
                    borderRadius: "0.25rem",
                    width: "100%",
                    boxSizing: "border-box",
                    marginBottom: "25px",
                  }}
                  autoComplete="current-email"
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} /> Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={!showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    style={{
                      background: "#f9f9f",
                      border: "1px solid #000000",
                      color: "black",
                      borderRadius: "0.25rem 0 0 0.25rem",
                      boxSizing: "border-box",
                      marginBottom: "25px",
                    }}
                    autoComplete="current-password"
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "0 0.25rem 0.25rem 0",
                        border: "1px solid #000000",
                        background: "#f9f9f",
                        color: "black",
                        padding: "0.75rem",
                        marginBottom: "25px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  background: "#6884e1",
                  color: "white",
                  padding: "10px",
                  width: "100%",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  border: "1px solid #000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                Sign In
              </button>

              {/* Don't have an account? */}
              <div className="mt-3 text-center">
                <p className="fw-bold fs-6">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#6884e1",
                      textDecoration: "none",
                    }}
                  >
                    Sign up for Free
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          {/* Overlay for loading spinner */}
          {loading && (
            <div className="overlay">
              <div className="spinner-container">
                <span className="ms-2 text-white">
                  Wait A Few Minutes...{" "}
                  <Spinner animation="border" variant="light" />
                </span>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
