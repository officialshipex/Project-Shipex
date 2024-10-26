import "./App.css";
import { useState, useEffect } from "react";
// import NavBar from "./components/Common/NavBar";
// import Dashboard from "./components/Dashboard/Dashboard";
// import { OrderDashboard } from "./components/Dashboard/OrderDashboard"; // Only import OrderDashboard
import OrderList from "./components/Dashboard/MainOrder"; // Uncomment this line to include OrderList
// import ReturnList from "./components/Dashboard/Main_Return_Request"; // Comment this line if you want to exclude ReturnList

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
      <OrderDashboard /> {/* Render OrderDashboard */}
      <OrderList /> {/* Render OrderList only */}
      {/* <ReturnList /> {/* This will render ReturnList only */}
    </div>
  );
}

export default App;
