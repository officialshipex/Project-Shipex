import "./App.css";

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState } from "react";

import LoginPage from "./components/Kyc/LoginPage";
import Registeration from "./register/Registration";

import KycRoutes from "./routes/KycRoutes";
import DashBoardRoute from "./routes/DashboardRoute";

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

        <Route
          path="/KycStep1"
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        />
          <Route path="/KycStep1" element={<KycStep1 />} />
        <Route path="/" element={<Registeration setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/kyc" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}/>
          <Route path="/kyc/*" element={<KycRoutes/>} />
        <Route path="/" element={<Registeration setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/kyc" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/kyc/*" element={<KycRoutes />} />
        </Route>

        <Route element={<PrivateRoute isAuthenticated={true} />}>
          <Route path="/seller/*" element={<DashBoardRoute />} />
        </Route>

      </Routes>
    </Router>
  );
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;