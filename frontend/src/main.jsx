import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import App from "./App";
import Paytm from "./payment/Paytm"

createRoot(document.getElementById("root")).render(<StrictMode>
    {/* <App/> */}
    <Paytm/>
</StrictMode>);
