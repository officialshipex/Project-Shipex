import Logo from "../../assets/Vector logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Image from "../../assets/image.png";
import PropsTypes from "prop-types";
import { useState } from "react";

const KycStep3 = (props) => {

  const { kycType, setKycType } = props; 
  // const [selectedOption, setSelectedOption] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleOptionChange = (e) => {
    setKycType(e.target.value);
  };

  const handleNextClick = () => {
    if (kycType === "digital") navigate("/kyc/digital");
    else if (kycType === "manual") navigate("/kyc/mannual");
    else setError("Please select an option to proceed!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-screen-lg xl:max-w-screen-xl p-6 lg:p-0 flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:ml-[300px] lg:mt-[-250px] mt-0">
        {/* Left section: Title and options */}
        <div className="w-full lg:w-1/2 space-y-4">
          <img src={Logo} alt="ShipEx Logo" className="mx-auto h-10 ml-1" />
          <h2 className="text-base sm:text-[18px] lg:text-xl font-bold text-gray-800 mt-2">
            Complete your KYC for a smoother delivery process!
          </h2>

          {/* Progress Bar */}
          <div className="relative pt-1 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-16 sm:w-20 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-8 sm:w-10 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Options */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Verify Your ID
          </h3>
          <div className="space-y-4">
            <button
              className={`w-full max-w-sm flex items-center justify-between px-4 py-3 border rounded-md mx-auto lg:mx-0 ${kycType === "digital"
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
                }`}
              value="digital"
              onClick={handleOptionChange}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-green-500"
                  viewBox="0 0 34 34"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M10 11.9999V8.66658H25V11.9999H10ZM10 16.9999V13.6666H25V16.9999H10ZM15 33.6666H5C3.61111 33.6666 2.43056 33.1805 1.45833 32.2082C0.486111 31.236 0 30.0555 0 28.6666V23.6666H5V0.333252H30V15.3749C29.4444 15.3194 28.8819 15.3402 28.3125 15.4374C27.7431 15.5346 27.1944 15.7082 26.6667 15.9582V3.66658H8.33333V23.6666H18.3333L15 26.9999H3.33333V28.6666C3.33333 29.1388 3.49306 29.5346 3.8125 29.8541C4.13194 30.1735 4.52778 30.3332 5 30.3332H15V33.6666ZM18.3333 33.6666V28.5416L27.5417 19.3749C27.7917 19.1249 28.0694 18.9444 28.375 18.8333C28.6805 18.7221 28.9861 18.6666 29.2917 18.6666C29.625 18.6666 29.9444 18.7291 30.25 18.8541C30.5555 18.9791 30.8333 19.1666 31.0833 19.4166L32.625 20.9582C32.8472 21.2082 33.0208 21.486 33.1458 21.7916C33.2708 22.0971 33.3333 22.4027 33.3333 22.7082C33.3333 23.0138 33.2778 23.3263 33.1667 23.6457C33.0555 23.9652 32.875 24.2499 32.625 24.4999L23.4583 33.6666H18.3333ZM20.8333 31.1666H22.4167L27.4583 26.0832L26.7083 25.2916L25.9167 24.5416L20.8333 29.5832V31.1666ZM26.7083 25.2916L25.9167 24.5416L27.4583 26.0832L26.7083 25.2916Z" />
                </svg>
                <span
                  className={`text-${kycType === "digital" ? "green-500" : "gray-800"
                    }`}
                >
                  Digital KYC
                </span>
              </div>
              <span className="text-sm text-gray-500 ml-12">
                Instant Activation
              </span>
            </button>

            <button
              className={`w-full max-w-sm flex items-center justify-between px-4 py-3 border rounded-md mx-auto lg:mx-0 ${kycType === "manual"
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
                }`}
              value="manual"
              onClick={handleOptionChange}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-gray-500"
                  viewBox="0 0 34 34"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M3.44016 30C2.51174 30 1.71695 29.6736 1.05581 29.0208C0.39466 28.3681 0.0640869 27.5833 0.0640869 26.6667V3.33333C0.0640869 2.41667 0.39466 1.63194 1.05581 0.979167C1.71695 0.326389 2.51174 0 3.44016 0H18.6325V3.33333H3.44016V26.6667H27.0726V11.6667H30.4487V26.6667C30.4487 27.5833 30.1181 28.3681 29.457 29.0208C28.7958 29.6736 28.0011 30 27.0726 30H3.44016ZM23.6966 10V6.66667H20.3205V3.33333H23.6966V0H27.0726V3.33333H30.4487V6.66667H27.0726V10H23.6966ZM5.12819 23.3333H25.3846L19.0545 15L13.9904 21.6667L10.1923 16.6667L5.12819 23.3333Z" />
                </svg>
                <span>Manual KYC</span>
              </div>
              <span className="text-sm text-gray-500 ml-3">
                (Takes 24 to 48 Hours)
              </span>
            </button>
          </div>
          {error && (<p className="text-red-500 text-sm">{error}</p>)}
        </div>

        {/* Right section: Illustration */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-72 lg:mr-0 flex flex-col items-center lg:items-start">
          <img
            src={Image}
            alt="KYC Illustration"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-xs h-auto mx-auto lg:mx-0 mt-4"
          />

          {/* Next Button */}
          <div className="flex justify-center lg:justify-start w-full mt-6">
            <button
              className="px-8 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6 sm:mt-12 ml-40"
              onClick={handleNextClick} // Handle Next button click
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

KycStep3.propTypes = {
  kycType: PropsTypes.string,
  setKycType: PropsTypes.func,
}

export default KycStep3;
