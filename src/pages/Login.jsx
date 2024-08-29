import React from "react";
import "../App.css";
import FormLogin from "../components/FormLogin";
import { Container } from "react-bootstrap";

export default function Login() {
  return (
  <Container fluid>
    <FormLogin/>
  </Container>
  );
}
