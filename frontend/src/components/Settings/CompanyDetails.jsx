import React, { useState } from "react";

const CompanyDetails = () => {
  const [logo, setLogo] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      setLogo(URL.createObjectURL(file)); // Display the uploaded logo
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="w-full lg:w-1/3 ml-0 lg:ml-24 mt-6 lg:mt-20 px-4 lg:px-0">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 flex items-center space-x-2 sm:space-x-1 sm:flex-wrap ">
          <span className="text-green-500 font-medium">Settings</span>
          <span>&gt;</span>
          <span className="text-gray-700 font-medium">Company Setup</span>
          <span>&gt;</span>
          <span className="text-gray-700 font-medium">Company Details</span>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-3/5 bg-white shadow-md p-2 h-auto rounded-md mb-4">
          <nav className="flex flex-col">
            <ul className="space-y-1 text-gray-600">
              <li className="hover:text-green-500 cursor-pointer font-bold text-sm">
                COMPANY SETUP
              </li>
              <li className="bg-green-100 text-green-500 py-1.5 px-3 w-full text-left font-medium rounded-md text-sm">
                Company Details
              </li>

              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Domestic KYC
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Pick Up Address
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Labels
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Billing, Invoice, & GSTIN
              </li>
            </ul>
          </nav>
        </aside>
      </main>

      <main className="w-full lg:w-full px-4 lg:px-10 py-6 mt-6 lg:mt-28">
        {/* Header */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Company Details
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          View, edit, and update the company-related details.
        </p>

        {/* Plan Information */}
        <div className="bg-white shadow rounded-md p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan Duration</p>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                3 Months
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company ID</p>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                25493
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                Lite Plan
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription Status</p>
              <button className="bg-green-200 text-green-500 px-3 py-1 rounded-full text-xs sm:text-sm">
                Active
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500">Renewal Date</p>
              <p className="text-base sm:text-lg font-medium text-gray-800">
                31-03-2025
              </p>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white shadow rounded-md p-4 sm:p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">Company Logo (Optional)</p>
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
            <label
              htmlFor="uploadLogo"
              className="w-24 sm:w-28 h-16 sm:h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-green-500 cursor-pointer"
            >
              <input
                id="uploadLogo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                aria-label="Upload Company Logo"
              />
              <span className="text-xl font-bold text-gray-500">+</span>
            </label>
            <div className="text-xs sm:text-sm text-gray-500">
              <p>Image size must be under 1 MB.</p>
              <p>(Recommended dimensions: 250 x 150).</p>
            </div>
          </div>
          {logo && (
            <img
              src={logo}
              alt="Uploaded Logo"
              className="mt-4 max-w-full sm:max-w-xs"
            />
          )}
        </div>

        {/* Company Details Form */}
        <div className="bg-white shadow rounded-md p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Registered Company Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Enter Company Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Enter Brand Name"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Complete Address
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Enter Address"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">State</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Enter State"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Pincode
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Enter Pincode"
                required
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button className="bg-white text-gray-700 border-2 border-gray-200 px-6 py-2 rounded-md flex items-center space-x-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Save</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails;
