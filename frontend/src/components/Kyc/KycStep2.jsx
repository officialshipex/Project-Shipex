import { useState } from "react";
import Logo from '../../assets/Vector logo.png';
import KycLogo from '../../assets/Illustration.png'; // Update this path according to your project structure

const KycStep2 = () => {
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    city: '',
    state: '',
    country: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const verifyGst = () => {
    // Add GST verification logic here
    console.log('Verifying GST:', gstNumber);
  };

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
            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
              GST Number (Optional)
            </label>
            <input
              type="text"
              id="gstNumber"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="GST Number (Optional)"
              className="w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

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
              <button
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

export default KycStep2;
