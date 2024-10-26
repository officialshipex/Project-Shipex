import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App";

// import Dashboard from "./components/Dashboard/DashBoard";
import OrderDashboard from "./components/Dashboard/OrderDashboard";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}

    {/* <Dashboard /> */}
    <OrderDashboard />
  </StrictMode>
);
