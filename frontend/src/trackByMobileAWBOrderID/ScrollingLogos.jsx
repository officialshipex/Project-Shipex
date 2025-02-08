import React from "react";
import Amazonship from "../assets/landingpage/amazonship.png"
import Shreemaruti from "../assets/landingpage/shrimaruti.png"
import Xpressbees from "../assets/landingpage/xpressbees.png"
import Shadowfax from "../assets/landingpage/shadowfax.png"
import Delehivery from "../assets/landingpage/delehivery.png"
import Gati from "../assets/landingpage/gati.png"
import Dtdc from "../assets/landingpage/dtdc.png"
import EcomExpress from "../assets/landingpage/ecomexpress.png"
import Bluedart from "../assets/landingpage/bluedart.png"
import Amazonshiping from "../assets/landingpage/amazonshiping.png"


const logos = [
  Amazonship,
  Shreemaruti,
  Xpressbees,
  Shadowfax,
  Delehivery,
  Gati,
  Dtdc,
  EcomExpress,
  Bluedart,
  Amazonshiping,
];

const ScrollingLogos = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-white py-4">
      <div className="flex space-x-8 animate-scroll">
        {logos.concat(logos).map((logo, index) => (
          <img key={index} src={logo} alt="Partner Logo" className="h-10 w-36" />
        ))}
      </div>
    </div>
  );
};

export default ScrollingLogos;
