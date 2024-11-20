
import KycLogo from "../../assets/Illustration.png"; // Update this path according to your project structure
import { validateGST } from "../../lib/validation";
import Logo from "../../assets/Vector logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PropTypes from 'prop-types';
import { useState } from "react";
import axios from "axios";
import { GSTModal } from "./Modal";

const KycStep2 = (props) => {

  const { setDocumentVerified, companyName, setCompanyName, gstNumber, setGstNumber, address, setAddress, session } = props;
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const [dataModalIsOpen, setDataModalIsOpen] = useState({});
  const [modalData, setModalData] = useState();

  const handleGstChange = (e) => {
    setMessage({});
    setSuccess(false);
    setDocumentVerified(prevState => ({
      ...prevState,
      gstin: false,
    }));
    setGstNumber(e.target.value);
    if (!validateGST(e.target.value)) {
      setMessage("GST Number is invalid");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const verifyGst = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");
    setError("");

    if (!validateGST(gstNumber)) {
      setMessage({gst:"Invalid GST Number"});
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
        setDocumentVerified(prevState => ({ ...prevState, gstVerified: true }));
        setSuccess(true);
        setMessage("GST Verified Successfully!");
      if (response?.data?.success) {
        setDocumentVerified(prevState => ({
          ...prevState,
          gstin: true,
        }));
        setSuccess({ gst: response.data.success });
        setMessage({ gst: response.data.message });
        setDataModalIsOpen(prevState => ({ ...prevState, gst: true }));
        setModalData(response.data.data);
      } else {
        setMessage({ gst: response.data.message });
      }

    }} catch (error) {
      console.error("GST Verification Error:", error);
      if (error?.response?.data?.message) {
        setMessage({ gst: error.response.data.message });
      } else {
        setMessage({ gst: error.response.data.message });
      }
    }

  };

  const handleNext = () => {
    if (!companyName || !address.addressLine1 || !address.pinCode || !address.city || !address.state || !address.country || !address.addressLine2) {
      setError("Please fill all the fields");
      return;
    }
    navigate("/kyc/step3"); // Navigate to KycStep3
  };

  if (dataModalIsOpen.gst) {
    return (<>
      <GSTModal
        modalData={modalData}
        setDataModalIsOpen={setDataModalIsOpen}
      />
    </>)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-5xl p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Logo and Title */}
        <div className="text-left">
          <img src={Logo} alt="ShipEx Logo" className="mx-auto h-8 sm:h-10 ml-1" />
          <h2 className="text-base sm:text-[18px] lg:text-xl font-bold text-gray-800 mt-2">
            Complete your KYC for a smoother delivery process!
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Company Details Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Address Form */}
          <div className="space-y-4">
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
          </div>

          {/* Right Column - Company Details */}
          <div className="space-y-4 mt-6 lg:mt-10">
            {/* Company Name */}
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
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

            {/* GST Number */}
            <label htmlFor="gst" className="block text-sm font-medium text-gray-700">
              GST Number (Optional)
            </label>
            <input
              type="text"
              id="gst"
              value={gstNumber}
              onChange={handleGstChange}
              placeholder="GST Number (Optional)"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {message.gst && (<p className={`text-sm text-center ${success ? 'text-green-600' : 'text-red-600'}`}>{message.gst}</p>)}
            {/* Verify Button */}
            <button
              onClick={verifyGst}
              className="w-full sm:w-[120px] px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Verify
            </button>

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


            {/* Next Button */}
            <div className="flex justify-end">
              {error && (<p className="text-sm text-red-600">{error}</p>)}
              <button
                onClick={handleNext}
                className="px-8 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6 sm:mt-12 "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

KycStep2.propTypes = {
  setDocumentVerified: PropTypes.func.isRequired,
  companyName: PropTypes.string.isRequired,
  setCompanyName: PropTypes.func.isRequired,
  gstNumber: PropTypes.string,
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

  session: PropTypes.string,
};

export default KycStep2;