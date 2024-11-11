// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import Paytm from "./payment/Paytm";
// // import App from "./App";

// // import Dashboard from "./components/Dashboard/DashBoard";
// // import OrderDashboard from "./components/Dashboard/OrderDashboard";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {/* <App /> */}
//     <Paytm />
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App";
// import MainOrder from "./components/Dashboard/MainOrder";
import Dashboard from "./components/Dashboard/DashBoard";
// import Support1 from "./components/Support/Support1";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    {/* <MainOrder /> */}
    <Dashboard />
    {/* <Support1 /> */}
  </StrictMode>
);
