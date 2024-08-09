import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../../src/assets/logo2.png";
import { Button } from "react-bootstrap";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Bora" className="navbar-logo-img" />
          <h2 className="mt-2">Bora</h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link text-center mx-auto text-decoration-none text-white"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className="nav-link text-center mx-auto text-decoration-none text-white"
              >
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link text-center mx-auto text-decoration-none text-white"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
