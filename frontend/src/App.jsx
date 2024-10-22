import "./App.css";
<<<<<<< HEAD
import "../src/components/Common/NavBar"
// import LoginPage from "../src/components/Kyc/LoginPage"
// import KycStep1 from "../src/components/Kyc/KycStep1"
// import KycStep2 from "../src/components/Kyc/KycStep2"
// import KycStep3 from "../src/components/Kyc/KycStep3"
// import KycStep4 from "../src/components/Kyc/KycStep4"
// import Agreement from "../src/components/Kyc/Agreement"
// import ThankyouPage from "./components/Kyc/ThankyouPage"
// import UploadId from "./components/Kyc/UploadId"
// import Writemanually from "./components/Kyc/Writemanually"

import { useState, useEffect } from "react";
import NavBar from "./components/Common/NavBar";  
=======
import { useState, useEffect } from "react";
import NavBar from "./components/Common/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import { OrderDashboard } from "./components/Dashboard/OrderDashboard"; // Only import OrderDashboard
>>>>>>> 2ce6923233659eaa7e848a6f22de77e626b97c90

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/v1/external/auth/login")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="app-container">
      <NavBar />
      <Dashboard />
      <OrderDashboard /> {/* Render OrderDashboard, which includes RtoDashboard */}
    </div>
  );
}

export default App;
