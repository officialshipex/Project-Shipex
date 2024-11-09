import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

import Registeration from "./registration/Registration";
import LoginPage from "./components/Kyc/LoginPage";
import KycRoutes from "./routes/KycRoutes";

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      <Navigate replace to="/login"></Navigate>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Registeration setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

<<<<<<< HEAD
        <Route
          path="/KycStep1"
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path="/KycStep1" element={<KycStep1 />} />
=======
        <Route path="/" element={<Registeration setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/kyc" element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
          <Route path="/kyc/*" element={<KycRoutes/>} />
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
        </Route>

      </Routes>
    </Router>
  );
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;
