import "./App.css";

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState } from "react";

<<<<<<< HEAD
import Registeration from "./registeraion/Registeration";
=======
import Writemanually from "../src/components/Kyc/Writemanually";
import ThankyouPage from "../src/components/Kyc/ThankyouPage";
import Registeration from "./registration/Registration";
import Agreement from "../src/components/Kyc/Agreement";
import KycStep1 from "../src/components/Kyc/KycStep1";
import KycStep2 from "../src/components/Kyc/KycStep2";
import KycStep3 from "../src/components/Kyc/KycStep3";
import KycStep4 from "../src/components/Kyc/KycStep4";
import UploadId from "../src/components/Kyc/UploadId";
>>>>>>> main
import LoginPage from "./components/Kyc/LoginPage";
import KycRoutes from "./routes/KycRoutes";

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ?
    <>
      <Outlet />
    </>
    : <><Navigate replace to='/login'></Navigate></>
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Registeration setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/kyc" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
          <Route path="/kyc/*" element={<KycRoutes/>} />
        </Route>

      </Routes>
    </Router>
  );
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;
