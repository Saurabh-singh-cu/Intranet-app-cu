
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import logo from "../assets/images/logo.png";
import circle from "../assets/images/intralogonew.jpeg"
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      openNotification(
        "warning",
        "reCAPTCHA Required",
        "Please complete the reCAPTCHA verification."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://172.17.2.247:8080/intranetapp/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_email: email,
            password: password,
            recaptcha: recaptchaValue,
          }),
        }
      );

      const data = await response.json();
      console.log(data, "USER GET");

      if (!response.ok) {
        throw new Error(data.message || "An error occurred during login");
      }

      // Save user data in local storage
      localStorage.setItem("user", JSON.stringify(data));

      openNotification(
        "success",
        "Login Successful",
        "Redirecting to dashboard..."
      );
      onLogin();

      // Redirect based on user role
      // if (data?.role_name === "Admin") {
      //   window.location.href = "/admin-dashboard";
      // } else if (data?.role_name === "Student Secretary") {
      //   window.location.href = "/student-secretary-dashboard";
      // } else if (data?.role_name === "Faculty Advisory") {
      //   window.location.href = "/faculty-advisory-dashboard";
      // } else {
      //   window?.location.href = "/"
      // }

      if (!data || !data.role_name) {
        console.error("Role name is missing or undefined");
        window.location.href = "/";
      } else {
        switch (data?.role_name) {
          case "Admin":
            window.location.href = "/admin-dashboard";
            break;
          case "Student Secretary":
            window.location.href = "/student-secretary-dashboard";
            break;
          case "Faculty Advisory":
            window.location.href = "/faculty-advisory-dashboard";
            break;
          default:
            console.warn(`Unexpected role: ${data.role_name}`);
            window.location.href = "/";
            break;
        }
      }
      

      console.log("Login successful", data);
    } catch (err) {
      openNotification("error", "Login Failed", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="logo-container">
            <img style={{width:"230px"}} src={circle} alt="Logo" />
          </div>
          <h2 className="login-title">Welcome back</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeComoqAAAAAM7fMSrGeagGkmaDdtqdt12MzRjE"
                onChange={handleRecaptchaChange}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="sign-in-link">
           Back to home page{" "}
            <a href="/" className="sign-in-anchor">
              Home
            </a>
          </p>
        </div>
      </div>
      <div className="login-image-container">
        <div className="login-image-overlay">
          <h1 className="image-title">Welcome to Cu-Intranet</h1>
          <p className="typewriter">
            Discover amazing features and boost your productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

