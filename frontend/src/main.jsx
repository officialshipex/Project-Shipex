import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Track from "./trackByMobileAWBOrderID/Track";



createRoot(document.getElementById("root")).render(
<StrictMode>
  <App />  
  {/* <Track/> */}
 </StrictMode>
);