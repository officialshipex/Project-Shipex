import { useState } from "react";
import Logo from "../../assets/Vector logo.png";

const KycStep1 = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-xl lg:max-w-5xl p-6 lg:p-8 space-y-6">
        {/* Logo and Title */}
        <div className="text-left">
          <img src={Logo} alt="ShipEx Logo" className="mx-auto h-10 ml-1" />
          <h2 className="text-lg lg:text-[18px] font-bold text-gray-800 mt-2">
            Complete your KYC for a smoother delivery process!
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 mb-2">
          <div className="flex items-center space-x-2 ml-0">
            <div className="w-32 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-16 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 lg:w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Business Type Selection */}
        <div className="space-y-2">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800">Select your Business type</h3>

          {["individual", "soleProprietor", "company"].map((option) => (
            <div
              key={option}
              className={`border p-4 lg:p-6 rounded-lg cursor-pointer ${
                selectedOption === option ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
              onClick={() => handleOptionChange(option)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="businessType"
                  id={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  className="h-4 w-4 text-green-600 border-green-600 focus:ring-green-600"
                />
                <label
                  htmlFor={option}
                  className="ml-3 text-sm lg:text-base font-medium text-gray-800"
                >
                  {option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
              </div>
              <p className="ml-7 text-sm lg:text-base text-gray-500">
                {option === "individual" && "A seller who is selling through online selling platforms, and has not registered the firm under Companies Act 2013."}
                {option === "soleProprietor" && "Registered Company as ‘Sole Proprietor’ under Companies Act 2013."}
                {option === "company" && "Registered company as ‘LLP’, ‘Private’, ‘Subsidiary’, ‘Holding’, etc., under Companies Act 2013."}
              </p>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-start mt-[-10px]">
          <button
            className="px-8 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-0 mt-2" // Remove focus:ring
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycStep1;
