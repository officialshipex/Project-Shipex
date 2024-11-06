import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Vector logo.png";

const InputField = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
    />
  </div>
);

const OTPModal = ({ onClose, onConfirm }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendTime, setResendTime] = useState(36); // initial countdown in seconds

  useEffect(() => {
    const timer =
      resendTime > 0 && setInterval(() => setResendTime(resendTime - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTime]);

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^\d$/.test(value) || value === "") {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on the next input box if current is not empty
      if (value && element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(otp.join(""));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Authenticate</h3>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        <p className="text-gray-700 text-sm mb-2">
          Enter the 6-digit OTP sent to your Aadhaar linked phone number by
          UIDAI
        </p>

        <p className="text-gray-700 text-sm mb-2">Enter OTP</p>

        <div className="flex space-x-2 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e.target, index)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <p className="text-gray-500">
            Resend OTP{" "}
            {resendTime > 0 ? `(${String(resendTime).padStart(2, "0")})` : ""}
          </p>
          <a href="#" className="text-green-600 hover:underline">
            Need help?
          </a>
        </div>

        <p className="text-gray-500 text-xs mb-4">
          This authentication will last only for this session.
        </p>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600 px-3 py-1">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white rounded-lg px-6 py-2 disabled:opacity-50"
            disabled={otp.includes("")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AadhaarModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg w-full max-w-xs h-auto min-h-[70px] p-4 sm:p ```javascript
:p-5 md:p-6 lg:p-8 xl:p-8 relative shadow-lg flex flex-col justify-between"
      >
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-2 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            Aadhaar is Valid
          </h3>
          <div className="text-left space-y-3 w-full text-xs md:text-sm">
            {[
              { label: "Aadhaar Number", value: "xxxx xxxx 7583" },
              { label: "Name", value: "Sandeep" },
              { label: "Date of Birth", value: "14-10-1995" },
              { label: "Address", value: "Bangalore, Karnataka" },
            ].map(({ label, value }, idx) => (
              <div className="flex justify-between border-b pb-2" key={idx}>
                <span className="font-semibold text-gray-600 w-16 sm:w-14 md:w-20">
                  {label}
                </span>
                <span className="text-right w-28 md:w-36 truncate text-xs md:text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-5">
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-lg px-6 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PANModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-3 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-1.5 sm:p-2 rounded-full mt-2 sm:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            PAN is Valid
          </h3>
          <div className="flex w-full flex-col md:flex-row justify-between text-xs md:text-sm space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              {[
                { label: "Provided Name", value: "Sandeep" },
                { label: "Registered Name", value: "Sandeep" },
                { label: "PAN Ref ID", value: "REF12345678" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              {[
                { label: "PAN", value: "ABCDE123 4F" },
                { label: "PAN Type", value: "Individual" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-300 w-full mt-4" />
        </div>
        <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-lg px-4 py-1.5 sm:px-6 sm:py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountVerificationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-4 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col">
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-2 rounded-full mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            Account Verification
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm space-y-6 md:space-y-0 md:space-x-10 p-4">
            {/* Left Column */}
            <div className="flex flex-col space-y-6 w-full md:w-1/2">
              {[
                { label: "Name Provided", value: "Sandeep" },
                { label: "IFSC", value: "xxxx xxxx 1234" },
                { label: "Name at Bank", value: "Active" },
                { label: "Branch", value: "Chang" },
                { label: "Account Deposited", value: "10000" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {/* Right Column */}
            <div className="flex flex-col space-y-6 w-full md:w-1/2">
              {[
                { label: "Bank A/C No", value: "Shipex" },
                { label: "Account Status Code", value: "Account is valid" },
                { label: "Bank", value: "HDFC" },
                { label: "City", value: "Chang" },
                { label: "Name Match Result", value: "---" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-300 w-full mt-4" />
        </div>

        <div className="flex justify-center w-full space-x-2 mt-2 sm:mt-4">
          <button
            onClick={onClose}
            class="bg-green-600 text-white rounded-lg px-6 py-2 mt-2 sm:mt-3 shadow-md hover:bg-green-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadId = () => {
  const navigate = useNavigate();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);
  const [isPANModalOpen, setIsPANModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleNextClick = () => navigate("/agreement");

  const handleAadhaarVerify = () => {
    if (aadhaarNumber.length !== 12) {
      setError("Aadhaar number must be 12 digits");
      return;
    }
    setError("");
    setIsOtpModalOpen(true);
  };

  const handleOtpConfirm = (otp) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsOtpModalOpen(false);
      setIsVerifying(false);
      setError("");
      setIsAadhaarModalOpen(true);
    }, 2000);
  };

  const handlePANVerify = () => {
    setIsPANModalOpen(true);
  };

  const handleAccountVerify = () => {
    setIsAccountModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white overflow-hidden -mt-10">
      {isOtpModalOpen && (
        <OTPModal
          onClose={() => setIsOtpModalOpen(false)}
          onConfirm={handleOtpConfirm}
        />
      )}
      {isAadhaarModalOpen && (
        <AadhaarModal onClose={() => setIsAadhaarModalOpen(false)} />
      )}
      {isPANModalOpen && <PANModal onClose={() => setIsPANModalOpen(false)} />}
      {isAccountModalOpen && (
        <AccountVerificationModal
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}

      <div className="w-full max-w-5xl p-6 space-y-4 lg:space-y-6">
        <div className="flex flex-col items-start space-y-2">
          <img src={Logo} alt="ShipEx Logo" className="h-10 mt-4" />
          <h2 className="text-base sm:text-[18px] lg:text-[16px] font-bold text-gray-800">
            Verify Your Account
          </h2>
        </div>

        <div className="relative pt-1 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="mt-6 lg:mt-12">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-6">
            <div className="flex flex-col gap-4 flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <InputField
                  label="Aadhar Card Number"
                  placeholder="Enter your number"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button
                    onClick={handleAadhaarVerify}
                    className="bg-gray-300 text-white rounded-lg px-6 lg:px-10 py-2 flex items-center justify-center"
                  >
                    {isVerifying ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : null}
                    Verify
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <InputField label="PAN" placeholder="XXXXX XXXXXXX" />
                <InputField
                  label="Name(Optional)"
                  placeholder="Enter your name"
                />
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button
                    onClick={handlePANVerify}
                    className="bg-green-600 text-white rounded-lg px-6 lg:px-10 py-2"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                <InputField
                  label="Account Number"
                  placeholder="Enter your account number"
                />
                <InputField
                  label="IFSC Code"
                  placeholder="Enter your IFSC code"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <InputField
                    label="Account Holder Name"
                    placeholder="Enter your name"
                  />
                  <InputField label="UPI ID" placeholder="Enter your UPI ID" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="text-gray-800 px-3 py-1">Cancel</button>
                  <button
                    onClick={handleAccountVerify}
                    className="bg-green-600 text-white rounded-lg px-6 lg:px-10 py-2"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleNextClick}
            className="bg-green-600 text-white rounded-lg px-6 lg:px-14 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadId;
