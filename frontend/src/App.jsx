import "./App.css";
import "../src/components/Common/NavBar"
// import LoginPage from "../src/components/Kyc/LoginPage";
// import KycStep1 from "../src/components/Kyc/KycStep1"
// import KycStep2 from "../src/components/Kyc/KycStep2"
import { useState, useEffect } from "react";
import NavBar from "./components/Common/NavBar";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/v1/external/auth/login")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);


  return (
    <>
    <NavBar/>
      <h1 className="underline">This is Frontend and </h1>
      <h1 className="font-bold">{message}</h1>
    </>
  );
}

export default App;
