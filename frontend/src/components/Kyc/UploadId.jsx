import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Logo from "../../assets/Vector logo.png";

const UploadId = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNextClick = () => {
    navigate("/agreement"); // Navigate to the Agreement page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white overflow-hidden -mt-10">
      <div className="w-full max-w-5xl p-6 space-y-4 lg:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-start space-y-2">
          <img src={Logo} alt="ShipEx Logo" className="h-10 mt-4" />
          <h2 className="text-base sm:text-[18px] lg:text-[16px] font-bold text-gray-800">
            Verify Your Account
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 mt-2">
          <div className="flex items-center space-x-2 ">
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 lg:mt-12">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-6">
            <div className="flex flex-col gap-4 flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Aadhar Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your number"
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button className="bg-gray-300 text-white rounded-lg px-6 lg:px-10 py-2">
                    Verify
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    PAN
                  </label>
                  <input
                    type="text"
                    placeholder="XXXXX XXXXXXX"
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button className="bg-green-600 text-white rounded-lg px-6 lg:px-10 py-2">
                    Verify
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Bank Account Verification */}
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your account number"
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your IFSC code"
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Your name"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your number"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button className="bg-gray-300 text-white rounded-lg px-6 lg:px-10 py-2">
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center md:justify-end mt-6">
          <button
            onClick={handleNextClick} // Add onClick handler for navigation
            className="bg-green-600 text-white rounded-lg px-8 lg:px-16 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadId;
