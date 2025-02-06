import React from "react";
import phoneIcon from "../assets/landingpage/call.png";
import emailIcon from "../assets/landingpage/mail.png";
import locationIcon from "../assets/landingpage/distance.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-100 to-white py-12 h-screen">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Let’s <span className="text-purple-600 font-bold">Grow</span> Together
        </h2>
        <p className="text-gray-600 mb-4">
          Stay informed about all developments and product updates at Shipex India!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your Email"
            className="p-3 w-full sm:w-1/2 border rounded-md"
          />
          <button className="bg-[#280847] text-[#F7CE23] px-12 md:px-16 py-3 rounded-md font-medium hover:bg-[#3a284a] transition">
              Subscribe
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h3 className="font-semibold"><img src={phoneIcon} alt="Phone" className="inline-block w-5 h-5 mr-2" /> Phone number</h3>
          <p className="text-gray-600">9813981344</p>
        </div>
        <div>
          <h3 className="font-semibold"><img src={emailIcon} alt="Email" className="inline-block w-5 h-5 mr-2" /> Email</h3>
          <p className="text-gray-600">care@shipexindia.in</p>
        </div>
        <div>
          <h3 className="font-semibold"><img src={locationIcon} alt="Location" className="inline-block w-5 h-5 mr-2" /> Location</h3>
          <p className="text-gray-600">
            #212 Tech Town, Aerocity, New Airport Road, Mohali, Punjab 140603 India
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-white py-12 md:mt-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-semibold">Policies</h3>
            <ul className="text-gray-600 mt-2 space-y-1">
              <li><Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
              <li><Link to="/refund-cancellation" className="text-blue-600 hover:underline">Refund & Cancellation Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-blue-600 hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
