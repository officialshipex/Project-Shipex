import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";

import LoginPage from "../src/components/Kyc/LoginPage";
import KycStep1 from "../src/components/Kyc/KycStep1";
import KycStep2 from "../src/components/Kyc/KycStep2";
import KycStep3 from "../src/components/Kyc/KycStep3";
import KycStep4 from "../src/components/Kyc/KycStep4";
import UploadId from "../src/components/Kyc/UploadId";
import Writemanually from "../src/components/Kyc/Writemanually";
import Agreement from "../src/components/Kyc/Agreement";
import ThankyouPage from "../src/components/Kyc/ThankyouPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/KycStep1" element={<KycStep1 />} />
        <Route path="/KycStep2" element={<KycStep2 />} />
        <Route path="/KycStep3" element={<KycStep3 />} />
        <Route path="/upload-id" element={<UploadId />} />
        <Route path="/kyc-step4" element={<KycStep4 />} />
        <Route path="/writemanually" element={<Writemanually />} />
        <Route path="/Agreement" element={<Agreement />} />
        <Route path="/thank-you" element={<ThankyouPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
