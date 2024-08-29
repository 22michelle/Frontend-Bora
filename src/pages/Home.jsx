import React from "react";
import Form from "../components/FormSupport.jsx";
import Welcome from "../components/Welcome.jsx";
import "../App.css";
import { Container } from "react-bootstrap";

export default function Home() {
  return (
    <Container fluid>
      <Welcome />
      <Form />
    </Container>
  );
}
