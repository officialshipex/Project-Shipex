import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App";

// import Dashboard from "./components/Dashboard/DashBoard";
// import OrderDashboard from "./components/Dashboard/OrderDashboard";
import KycStep1 from "./components/Kyc/KycStep1";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}

    {/* <Dashboard /> */}
    {/* <OrderDashboard /> */}
    <KycStep1 />
  </StrictMode>
);
