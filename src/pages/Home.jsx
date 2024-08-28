import React from "react";
import Footer from "../components/Footer.jsx";
import Form from "../components/FormSupport.jsx";
import Welcome from "../components/Welcome.jsx";
import "../App.css";

export default function Home() {
  return (
    <>
      <Welcome />
      <Form />
      <Footer />
    </>
  );
}
