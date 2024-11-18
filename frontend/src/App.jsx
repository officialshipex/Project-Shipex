import "./App.css";
// import { useState, useEffect } from "react";
// import NavBar from "./components/Common/NavBar";
// import Dashboard from "./components/Dashboard/Dashboard"; // Import Dashboard
// import OrderDashboard from "./components/Dashboard/OrderDashboard"; // Import OrderDashboard
// import OrderList from "./components/Dashboard/MainOrder"; // Import OrderList
// import ReturnList from "./components/Dashboard/Main_Return_Request"; // Import only ReturnList
// import BillingList from "./components/Dashboard/Main_Billing"; // Import BillingList
// import NDR from "./components/Dashboard/Main_ndr"; // Commented out NDR import

// import CRFIDPopup from "./components/Dashboard/Billing_COD Remittance_CRF id";
// import Modal from "./components/Dashboard/Billing_COD remittance_CRF ID";
// import COD from "./components/Dashboard/Billing_COD Remittance_COD available details";
// import Staff from "./components/user management view/view staff";
 // import AddStaff from "./components/user management view/viewDashboardUserManagement";
// import NewOrder from "./components/Dashboard/Order"; // Import Order only
import AddOrder from "./components/AddOrder/Add Order_Single Shipment";

function App() {
  return (
    <>
      <AddOrder /> {/* Render only Order */}
    </>
  );
}

export default App;
