import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="w-auto text-center">
      <Row className=" card mx-auto">
        <h1 className="display-3 mb-4">Welcome to Bora!</h1>
        <p className=" mb-4">
          Bora is not just another wallet. It's powered by the Resilience
          Network Protocol, connecting users globally in a secure and
          transparent way.
        </p>
        <hr />
        <span>"May your connections be stronger"</span>
        <Link to="/register">
          <button className="btn explore mt-4">Explore Bora</button>
        </Link>
      </Row> 
    </Container>
 
  );
}
