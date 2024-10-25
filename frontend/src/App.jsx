import "./App.css";
import { useState, useEffect } from "react";
// import NavBar from "./components/Common/NavBar";
// import Dashboard from "./components/Dashboard/Dashboard";
// import { OrderDashboard } from "./components/Dashboard/OrderDashboard"; // Only import OrderDashboard
import OrderList from "./components/Dashboard/MainOrder";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/v1/external/auth/login")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="app-container">
      {/* <NavBar />
      <Dashboard />
      <OrderDashboard /> {/* Render OrderDashboard*/}
      <OrderList /> {/* This will render OnlyNavAndSidebar */}
    </div>
  );
}

export default App;
