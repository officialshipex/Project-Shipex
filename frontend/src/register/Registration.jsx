import { useState } from 'react';
import PropTypes from 'prop-types';

import RegistrationForm from "./RegistrationForm";
import UniqueFeatures from "./UniqueFeature";
import OurOneStopSolutions from "./OurOneStopSolution";
import PartnersSection from "./PartnersSection";


import TrackByNumber from "./TrackByNumber";

import Illustration from "../assets/track/Illustration.png";
import Shipments from "../assets/track/shipments.png";
import Partners from "../assets/track/partners.png";
import Location from "../assets/track/location.png";
import Seller from "../assets/track/seller.png";
import Buyer from "../assets/track/buyer.png";
import Logo from "../assets/track/Group.png";
import Join from "../assets/track/join.png";


const Registeration = ({ setIsAuthenticated }) => {

  const [role, setRole] = useState("seller");


  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row items-center lg:justify-center lg:gap-32 p-4 lg:p-8 px-2 sm:px-12 lg:px-16 bg-white min-h-screen">

          {/* Left section */}
          <div className="lg:w-1/3 w-full space-y-5 text-center lg:text-left mb-8 lg:mb-0">
            <img src={Logo} alt="Logo" className="mx-auto lg:mx-0 w-28 lg:w-32" />
            <h1 className="text-md lg:text-lg font-bold text-green-600">Become a Part of ShipEx</h1>
            <p className="text-gray-600 text-sm lg:text-base px-4 lg:px-0">
              Register now to experience hassle-free shipping, reliable logistics, and dedicated support for your business needs. Unlock the potential for growth and efficiency in your operations.
            </p>
            <ul className="space-y-4 text-gray-700 px-3 lg:px-0 w-full lg:w-[88%]">
              <li className="flex items-center gap-3">
                <img src={Location} alt="location" className="w-8" />
                <p className="text-sm text-left">Ship anywhere in India with our nationwide delivery network</p>
              </li>
              <li className="flex items-center gap-3">
                <img src={Partners} alt="partners" className="w-8" />
                <p className="text-sm text-left">We have 25+ partners for all your shipping needs.</p>
              </li>
              <li className="flex items-center gap-3">
                <img src={Join} alt="join" className="w-8" />
                <p className="text-sm text-left">Join 20,000+ sellers using our trusted logistics</p>
              </li>
              <li className="flex items-center gap-3">
                <img src={Shipments} alt="shipments" className="w-8" />
                <p className="text-sm text-left">We handle 50,000+ daily shipments efficiently</p>
              </li>
            </ul>
            <img src={Illustration} alt="illustration" className="w-[60%] h-[40%] mx-auto lg:mx-0" />
          </div>

          {/* Right section - Minimize width */}
          <div className="lg:w-3/5 xl:w-5/12 w-full bg-green-50 border-green-200 border-[1px] p-4 lg:p-8 rounded-lg shadow-lg">

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              {/* Seller Radio Button */}
              <label className={`flex items-center space-x-2 border-[2px] border-green-600 h-16 w-full sm:w-56 gap-1 p-2 rounded-md ${role === "seller" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>
                <img src={Seller} alt="seller" className="w-8" />
                <div>
                  <p className='text-[12px] font-bold tracking-wider'>I am Seller</p>
                  <p className='text-[8px] font-bold'>I sell products online</p>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  className="hidden"
                  onChange={(e) => setRole(e.target.value)}
                  checked={role === "seller"}
                />
              </label>

              {/* Buyer Radio Button */}
              <label className={`flex items-center space-x-2 border-[2px] border-green-600 h-16 w-full sm:w-56 gap-1 p-2 rounded-md ${role === "buyer" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>
                <img src={Buyer} alt="buyer" className="w-8" />
                <div>
                  <p className='text-[12px] font-bold tracking-wider'>I am Buyer</p>
                  <p className='text-[8px] font-bold'>I want to track my order</p>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  className="hidden"
                  onChange={(e) => setRole(e.target.value)}
                  checked={role === "buyer"}
                />
              </label>
            </div>

            <div>
              {role === "seller"
                ? <RegistrationForm setIsAuthenticated={setIsAuthenticated} />
                : <TrackByNumber />}
            </div>

          </div>
        </div>

        <UniqueFeatures />
        <OurOneStopSolutions />
        <PartnersSection />

      </div>
    </>
  );
};

Registeration.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Registeration;