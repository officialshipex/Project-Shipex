import PropTypes from 'prop-types';

import OurOneStopSolutions from "../trackByMobileAWBOrderID/OurOneStopSolution"
import PartnersSection from "../trackByMobileAWBOrderID/PartnersSection"
import UniqueFeatures from "../trackByMobileAWBOrderID/UniqueFeature"
import RegisterationForm from "./RegisterationForm"

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
};

export default Registeration


