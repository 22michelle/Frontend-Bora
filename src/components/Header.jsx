import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/authActions,js";
import "../App.css";
import { Button } from "react-bootstrap";
import logo from "../../src/assets/logo2.png";

export default function Header() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

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
            {!token ? (
              <>
                <li className="nav-item">
                  <a className="nav-link mx-auto" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link mx-auto" href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link mx-auto" href="/login">
                    Login
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Button className="nav-link text-white" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
