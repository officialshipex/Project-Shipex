<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Vector logo.png";
import KycLogo from "../../assets/Illustration.png";

const KycStep2 = () => {
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
=======

import KycLogo from "../../assets/Illustration.png"; // Update this path according to your project structure
import { validateGST } from "../../lib/validation";
import Logo from "../../assets/Vector logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getTokens } from "../../lib/session";
import PropTypes from 'prop-types';
import { useState } from "react";
import axios from "axios";

const KycStep2 = (props) => {

  const { setDocumentVerified, companyName, setCompanyName, gstNumber, setGstNumber, address, setAddress } = props;
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c

  const handleGstChange = (e) => {
    setMessage("");
    setGstNumber(e.target.value);
    if(!validateGST(e.target.value)){
      setMessage("GST Number is invalid");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

<<<<<<< HEAD
  const verifyGst = () => {
    if (gstNumber) {
      setModalMessage(`GST Number ${gstNumber} verified successfully!`);
    } else {
      setModalMessage("Please enter a valid GST Number.");
    }
    setIsModalOpen(true);
  };

  const handleNext = () => {
    navigate("/KycStep3");
=======
  const verifyGst = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");

    const session = getTokens();
    if (!session) {
      navigate("/login");
      return;
    }

    if (!validateGST(gstNumber)) {
      setMessage("Invalid GST Number");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/v1/merchant/verfication/gstin', {
        GSTIN: gstNumber,
        businessName: companyName || "ShipEx",
      }, {
        headers: {
          authorization: `Bearer ${session}`
        }
      })
      console.log("GST Verification Response:", response.data);

      if (response.data.success) {
        setDocumentVerified( prevState => ({...prevState, gstVerified: true}));
        setSuccess(true);
        setMessage("GST Verified Successfully!");
      } else {
        setMessage("Invalid GST Number");
      }

    } catch (error) {
      console.error("GST Verification Error:", error);
      if (error?.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again later.");
      }
    }

  };

  const handleNext = () => {
    if(!companyName || !address.addressLine1 || !address.pinCode || !address.city || !address.state || !address.country || !address.addressLine2){
      setError("Please fill all the fields");
      return;
    }
    navigate("/kyc/step3"); // Navigate to KycStep3
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
          .overflow-hidden::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="bg-white w-full max-w-5xl p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="text-left">
<<<<<<< HEAD
          <img
            src={Logo}
            alt="ShipEx Logo"
            className="mx-auto h-8 sm:h-10 ml-1"
          />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mt-2">
=======
          <img src={Logo} alt="ShipEx Logo" className="mx-auto h-8 sm:h-10 ml-1" />
          <h2 className="text-base sm:text-[18px] lg:text-xl font-bold text-gray-800 mt-2">
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
            Complete your KYC for a smoother delivery process!
          </h2>
        </div>

        <div className="relative pt-1 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <div className="space-y-4">
<<<<<<< HEAD
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Enter your company details
            </h3>
            {Object.keys(address).map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={address[key]}
                  onChange={handleInputChange}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
=======
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Enter your company details</h3>

            {/* Address Line 1 */}
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={address.addressLine1}
              onChange={handleInputChange}
              placeholder="Address Line 1"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Address Line 2 */}
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={address.addressLine2}
              onChange={handleInputChange}
              placeholder="Address Line 2"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Pin Code */}
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
              Pin Code
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={address.pinCode}
              onChange={handleInputChange}
              placeholder="Pin Code"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* City */}
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* State */}
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Country */}
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
          </div>

          <div className="space-y-4 mt-6 lg:mt-10">
<<<<<<< HEAD
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
=======
            {/* Company Name */}
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

<<<<<<< HEAD
            <label
              htmlFor="gstNumber"
              className="block text-sm font-medium text-gray-700"
            >
=======
            {/* GST Number */}
            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
              GST Number (Optional)
            </label>
            <input
              type="text"
              id="gstNumber"
              value={gstNumber}
              onChange={handleGstChange}
              placeholder="GST Number (Optional)"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
<<<<<<< HEAD

=======
            {message && (<p className={`text-sm text-center ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>)}
            {/* Verify Button */}
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
            <button
              onClick={verifyGst}
              className="w-full sm:w-[120px] px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Verify
            </button>

<<<<<<< HEAD
            <div className="mt-9 lg:mt-0">
              <img
                src={KycLogo}
                alt="KYC Illustration"
                className="w-full sm:w-3/4 mx-auto mt-6"
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-4 font-bold text-center lg:text-left w-full sm:w-[80%] lg:w-[70%] mx-auto lg:mx-0 lg:ml-20 lg:mr-20">
                This will be used as your company address for the pick-up
                location.
              </p>
            </div>
=======
          {/* KYC Illustration */}
<div className="mt-9 lg:mt-0">
  <img
    src={KycLogo}
    alt="KYC Illustration"
    className="w-full sm:w-3/4 mx-auto mt-6"
  />
 <p className="text-xs sm:text-sm text-gray-600 mt-4 font-bold text-center lg:text-left w-full sm:w-[80%] lg:w-[70%] mx-auto lg:mx-0 lg:ml-20 lg:mr-20">
  This will be used as your company address for the pick-up location.
</p>

</div>

>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c

            <div className="flex justify-end">
            {error && (<p className="text-sm text-red-600">{error}</p>)}
              <button
<<<<<<< HEAD
                className="px-8 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6 sm:mt-12 w-full sm:w-auto" // Added w-full for mobile view
                onClick={handleNext}
=======
                onClick={handleNext}
                className="px-8 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6 sm:mt-12 "
>>>>>>> 69f180dda5c7701c3ebf07ed3cd5dd800c75951c
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gst Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[75%] md:max-w-[45%] max-h-[95vh] flex flex-col">
            <div className="flex flex-col items-center">
              {/* Success Icon */}
              <div className="bg-green-500 rounded-full p-4 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
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

              {/* Title */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
                GSTIN is Valid
              </h3>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow max-h-[80vh]">
              {/* GSTIN Details */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-sm text-gray-700 w-full">
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium w-1/3 sm:w-1/4">GSTIN</span>
                  <span className="text-right flex-1">
                    {gstNumber || "06HBDC748347953947"}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium">GST Ref. ID</span>
                  <span className="text-right flex-1">65893</span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium w-1/3 sm:w-1/3">
                    Tax payer type
                  </span>
                  <span className="text-right flex-1">Regular</span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium w-1/3 sm:w-1/4">
                    Date of Registration
                  </span>
                  <span className="text-right flex-1">2021-11-18</span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium w-1/3 sm:w-1/4">
                    Name of Business
                  </span>
                  <span className="text-right flex-1">Shipex</span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-300">
                  <span className="font-medium w-1/3 sm:w-1/2">
                    Legal Name of Business
                  </span>
                  <span className="text-right flex-1">Sandeep</span>
                </div>
                <div className="flex justify-between p-2">
                  <span className="font-medium w-1/3 sm:w-1/4">
                    GSTIN Status
                  </span>
                  <span className="text-right flex-1">Active</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center w-full mt-4">
              <button
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ease-in-out text-center"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

KycStep2.propTypes = {
  setDocumentVerified: PropTypes.func.isRequired,
  companyName: PropTypes.string.isRequired,
  setCompanyName: PropTypes.func.isRequired,
  gstNumber: PropTypes.string.isRequired,
  setGstNumber: PropTypes.func.isRequired,
  address: PropTypes.shape({
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    pinCode: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  setAddress: PropTypes.func.isRequired,
};

export default KycStep2;
