import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Logo from "../../assets/Vector logo.png";

const Writemanually = () => {
  const [aadharImage, setAadharImage] = useState(null);
  const [chequeImage, setChequeImage] = useState(null);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleAadharChange = (e) => {
    setAadharImage(e.target.files[0]);
  };

  const handleChequeChange = (e) => {
    setChequeImage(e.target.files[0]);
  };

  const handleNext = () => {
    navigate("/agreement"); // Navigate to the agreement page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 bg-white overflow-hidden">
      <div className="w-full max-w-5xl p-4 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col items-start space-y-2">
          <img src={Logo} alt="ShipEx Logo" className="h-10 mt-4" />
          <h2 className="text-base sm:text-[18px] lg:text-[16px] font-bold text-gray-800">
            Verify Your Account
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-4 lg:mt-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Aadhar Verification */}
            <div className="flex flex-col space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4 space-y-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Aadhar Card Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your number"
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button className="bg-gray-300 text-white rounded-lg px-6 lg:px-10 py-2">
                    Verify
                  </button>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4 space-y-2">
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

            {/* Right Column: Image Upload Sections */}
            <div className="flex flex-col space-y-4">
              {/* Aadhar Image Upload Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-6 space-y-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center rounded-lg">
                    <input
                      type="file"
                      onChange={handleAadharChange}
                      className="hidden"
                      id="aadharImage"
                    />
                    <label
                      htmlFor="aadharImage"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        width="30"
                        height="38"
                        viewBox="0 0 39 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.91667 37.75C3.77083 37.75 2.78993 37.342 1.97396 36.526C1.15799 35.7101 0.75 34.7292 0.75 33.5833V4.41667C0.75 3.27083 1.15799 2.28993 1.97396 1.47396C2.78993 0.657986 3.77083 0.25 4.91667 0.25H23.6667V4.41667H4.91667V33.5833H34.0833V14.8333H38.25V33.5833C38.25 34.7292 37.842 35.7101 37.026 36.526C36.2101 37.342 35.2292 37.75 34.0833 37.75H4.91667ZM29.9167 12.75V8.58333H25.75V4.41667H29.9167V0.25H34.0833V4.41667H38.25V8.58333H34.0833V12.75H29.9167ZM7 29.4167H32L24.1875 19L17.9375 27.3333L13.25 21.0833L7 29.4167Z"
                          fill="black"
                        />
                      </svg>
                      <span className="text-gray-500 mt-2">
                        Upload Aadhar Image
                      </span>
                    </label>
                  </div>
                  {aadharImage && (
                    <p className="text-green-600">
                      Aadhar Image Uploaded: {aadharImage.name}
                    </p>
                  )}
                  {/* Verify Button for Aadhar */}
                  <button className="mt-4 bg-gray-300 text-white rounded-lg px-4 py-1">
                    Verify{" "}
                  </button>
                </div>
              </div>

              {/* Blank Cheque Image Upload Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-6 space-y-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center ">
                    <input
                      type="file"
                      onChange={handleChequeChange}
                      className="hidden"
                      id="chequeImage"
                    />
                    <label
                      htmlFor="chequeImage"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        width="30"
                        height="38"
                        viewBox="0 0 39 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.91667 37.75C3.77083 37.75 2.78993 37.342 1.97396 36.526C1.15799 35.7101 0.75 34.7292 0.75 33.5833V4.41667C0.75 3.27083 1.15799 2.28993 1.97396 1.47396C2.78993 0.657986 3.77083 0.25 4.91667 0.25H23.6667V4.41667H4.91667V33.5833H34.0833V14.8333H38.25V33.5833C38.25 34.7292 37.842 35.7101 37.026 36.526C36.2101 37.342 35.2292 37.75 34.0833 37.75H4.91667ZM29.9167 12.75V8.58333H25.75V4.41667H29.9167V0.25H34.0833V4.41667H38.25V8.58333H34.0833V12.75H29.9167ZM7 29.4167H32L24.1875 19L17.9375 27.3333L13.25 21.0833L7 29.4167Z"
                          fill="black"
                        />
                      </svg>
                      <span className="text-gray-500 mt-2">
                        Upload Blank Cheque Image
                      </span>
                    </label>
                  </div>
                  {chequeImage && (
                    <p className="text-green-600">
                      Blank Cheque Image Uploaded: {chequeImage.name}
                    </p>
                  )}
                  {/* Verify Button for Cheque */}
                  <button className="mt-4 bg-gray-300 text-white rounded-lg px-4 py-1">
                    Verify{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center md:justify-end mt-8">
          <button
            onClick={handleNext}
            className="bg-green-600 text-white rounded-lg px-8 lg:px-16 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Writemanually;
