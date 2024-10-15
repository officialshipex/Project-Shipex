import "./App.css";
import "../src/components/Common/NavBar"
// import LoginPage from "../src/components/Kyc/LoginPage";
// import KycStep1 from "../src/components/Kyc/KycStep1"
// import KycStep2 from "../src/components/Kyc/KycStep2"
import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
    <h1>{message}</h1>
      
   </>
  );
}

export default App;
