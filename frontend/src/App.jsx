import "./App.css";
import { useState, useEffect } from "react";
// import NavBar from "./components/Common/NavBar";
// import Dashboard from "./components/Dashboard/Dashboard"; // Import Dashboard
import { OrderDashboard } from "./components/Dashboard/OrderDashboard"; // Import OrderDashboard
// import OrderList from "./components/Dashboard/MainOrder"; // Import OrderList
// import ReturnList from "./components/Dashboard/Main_Return_Request"; // Import ReturnList
// import BillingList from "./components/Dashboard/Main_Billing"; // Import BillingList

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/v1/external/auth/login")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="app-container">
      <OrderDashboard /> {/* Only OrderDashboard will be displayed */}
    </div>
  );
}

export default App;
