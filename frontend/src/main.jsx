import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import KycStep1 from "./components/Kyc/KycStep1";
import WalletRecharge from "./payment/WalletRecharge";
// import Paytm from "./payment/Paytm"
// import App from "./App";
// import Main_Billing from "./components/Dashboard/main_Billing"
// import Main_ndr from "./components/Dashboard/Main_ndr"

// import Dashboard from "./components/Dashboard/DashBoard";
// import OrderDashboard from "./components/Dashboard/OrderDashboard";
// import KycStep1 from "./components/Kyc/KycStep1";
// import Dashboard from "./components/Dashboard/DashBoard";
// import MainOrder from "./components/Dashboard/MainOrder"
// import OrderDashboard from "./components/Dashboard/OrderDashboard";


createRoot(document.getElementById("root")).render(
<StrictMode>
  {/* <App /> */}
  <WalletRecharge/>

 
 
</StrictMode>
);
