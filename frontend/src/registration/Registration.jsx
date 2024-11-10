import PropTypes from "prop-types";

import OurOneStopSolutions from "../trackByMobileAWBOrderID/OurOneStopSolution";
import PartnersSection from "../trackByMobileAWBOrderID/PartnersSection";
import UniqueFeatures from "../trackByMobileAWBOrderID/UniqueFeature";
import RegisterationForm from "./RegistrationForm";

const Registeration = ({ setIsAuthenticated }) => {
  return (
    <div>
      <RegisterationForm setIsAuthenticated={setIsAuthenticated} />
      <UniqueFeatures />
      <OurOneStopSolutions />
      <PartnersSection />
    </div>
  );
};

Registeration.propTypes = {
  setIsAuthenticated: PropTypes.bool.isRequired,
};

export default Registeration;
