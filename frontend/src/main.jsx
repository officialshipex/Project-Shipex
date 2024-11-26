import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Support from "./components/Support/Support.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Support />
  </StrictMode>
);
