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
// import Main_Return_Request from "./components/Dashboard/Main_Return_Request";
// import Support1 from "./components/Support/Support1";
// import SupportAwaitedResponse from "./components/Support/SupportAwaitedResponse";
// import SupportClosed from "./components/Support/SupportClosed";
import SupportCreateList from "./components/Support/SupportCreateList";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    {/* <MainOrder /> */}
    {/* <Main_Return_Request /> */}

    {/* <Support1 /> */}
    {/* <SupportAwaitedResponse /> */}
    {/* <SupportClosed /> */}
    <SupportCreateList />
  </StrictMode>
);
