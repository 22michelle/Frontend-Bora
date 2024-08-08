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
            <>
              <li className="nav-item">
                <Button className="nav-link mx-auto" to="/">
                  <Link to="/" className="text-decoration-none text-white">
                    {" "}
                    Home
                  </Link>
                </Button>
              </li>
              <li className="nav-item">
                <Button className="nav-link mx-auto" to="/register">
                  <Link
                    to="/register"
                    className="text-decoration-none text-white"
                  >
                    Register
                  </Link>
                </Button>
              </li>
              <li className="nav-item">
                <Button className="nav-link mx-auto" to="/login">
                  <Link to="/login" className="text-decoration-none text-white">
                    {" "}
                    Login
                  </Link>
                </Button>
              </li>
            </>
          </ul>
        </div>
      </div>
    </nav>
  );
}
