import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import App from "./App";
// import CourierShipRocket from "./B2C/CourierShipRocket";

createRoot(document.getElementById("root")).render(<StrictMode>
    <App/>
    
</StrictMode>);

