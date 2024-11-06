import PropTypes from "prop-types";

import OurOneStopSolutions from "../trackByMobileAWBOrderID/OurOneStopSolution";
import PartnersSection from "../trackByMobileAWBOrderID/PartnersSection";
import UniqueFeatures from "../trackByMobileAWBOrderID/UniqueFeature";
import RegisterationForm from "./RegistrationForm";

<<<<<<< HEAD
const Registeration = ({ setIsAuthenticated }) => {
  return (
    <div>
      <RegisterationForm setIsAuthenticated={setIsAuthenticated} />
      <UniqueFeatures />
      <OurOneStopSolutions />
      <PartnersSection />
    </div>
  );
=======
const Registeration = ({setIsAuthenticated}) => {
    return (
        <div>
            <RegisterationForm setIsAuthenticated={setIsAuthenticated}/>
            <UniqueFeatures />
            <OurOneStopSolutions />
            <PartnersSection />

        </div>
    )
}

Registeration.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
};

Registeration.propTypes = {
  setIsAuthenticated: PropTypes.bool.isRequired,
};

export default Registeration;
