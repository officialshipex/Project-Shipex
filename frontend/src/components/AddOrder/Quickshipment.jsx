import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";





function PackageDetailsForm() {
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", breadth: "", height: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "weight") {
      setWeight(value);
    } else {
      setDimensions({ ...dimensions, [name]: value });
    }
  };

  return (
    <div className="bg-green-50 h-screen flex items-center justify-left px-6">
      <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-3xl relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Package Details</h2>

        {/* Weight and Dimensions Row */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Weight Input */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">Weight</label>
            <div className="flex">
              <input
                type="number"
                name="weight"
                value={weight}
                onChange={handleInputChange}
                placeholder="Enter weight"
                className="w-full border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-r-md flex items-center justify-center">
                Kg
              </span>
            </div>
          </div>

          {/* Dimensions Input */}
          <div className="col-span-3">
            <label className="block text-gray-700 font-medium mb-2">Enter Dimensions</label>
            <div className="grid grid-cols-3 gap-4">
              {["length", "breadth", "height"].map((dim) => (
                <div key={dim} className="flex">
                  <input
                    type="number"
                    name={dim}
                    value={dimensions[dim]}
                    onChange={handleInputChange}
                    placeholder={dim.charAt(0).toUpperCase()}
                    className="w-full border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-r-md flex items-center justify-center">
                    CM
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 inline-block ml-2">
            (Max 3 digits after decimal place)
          </p>
          <p className="text-gray-700 text-sm">
            Note: the minimum chargeable weight is <span className="font-medium">0.50 kg</span>
          </p>
        </div>

        {/* Volumetric Weight */}
        <div className="mb-6">
          <h3 className="text-gray-700 font-medium">Package details</h3>
          <p className="text-lg font-semibold text-gray-800">Volumetric Weight: 0 kg</p>
        </div>
      </div>
    </div>
  );
}



const OrderForm = () => {
  return (
    <div className="min-h-screen bg-green-50"> {/* Set the entire background to light green */}
      <div className="bg-green-50 p-8 w-full min-h-screen"> {/* Inside container background */}
        
        {/* Product Details Heading with Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button className="bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-500 transition">
            Add Product
          </button>
        </div>

        {/* Product Details Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-800">Product Name</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Quantity</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter Qty"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Unit Price</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter unit price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Product Category</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter product category"
            />
          </div>
        </div>

        {/* Package Details Section with light green background */}
        <div className="bg-green-50 text-gray-800 rounded-md p-8 w-full max-w-3xl relative mt-4">
          <h2 className="text-xl font-semibold mb-6">Package Details</h2>

          {/* Weight and Dimensions Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Weight Input */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Weight</label>
              <div className="flex">
                <input
                  type="number"
                  name="weight"
                  placeholder="Enter weight"
                  className="w-full border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-r-md flex items-center justify-center">
                  Kg
                </span>
              </div>
            </div>

            {/* Dimensions Input */}
            <div className="col-span-3">
              <label className="block text-gray-700 font-medium mb-2">Enter Dimensions</label>
              <div className="grid grid-cols-3 gap-4">
                {["length", "breadth", "height"].map((dim) => (
                  <div key={dim} className="flex">
                    <input
                      type="number"
                      name={dim}
                      placeholder={dim.charAt(0).toUpperCase()}
                      className="w-full border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-r-md flex items-center justify-center">
                      CM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Details Additional Notes */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 inline-block ml-2">(Max 3 digits after decimal place)</p>
            <p className="text-gray-700 text-sm">
              Note: the minimum chargeable weight is <span className="font-medium">0.50 kg</span>
            </p>
          </div>

          {/* Volumetric Weight Section */}
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium">Package details</h3>
            <p className="text-lg font-semibold text-gray-800">Volumetric Weight: 0 kg</p>
          </div>

          {/* Payment Section */}
          <h2 className="text-xl font-bold mb-6">Payment</h2>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center">
              <input type="radio" name="payment" value="COD" className="mr-2" />
              COD
            </label>
            <label className="flex items-center">
              <input type="radio" name="payment" value="Prepaid" className="mr-2" />
              Prepaid
            </label>
          </div>

        </div>

        {/* Render Next button */}
        <div className="flex justify-end mt-6">
          {/* Add a button here */}
        </div>
      </div>
    </div>
  );
};







// BuyerForm Component
const BuyerForm = ({ onBillingAddressToggle }) => {
  // State for optional fields
  const [completeName, setCompleteName] = useState("");
  const [gstin, setGstin] = useState("");

  const handleCompleteNameChange = (e) => setCompleteName(e.target.value);
  const handleGstinChange = (e) => setGstin(e.target.value);

  return (
    <div className="bg-green-50 p-8 rounded-lg shadow-md w-full">
      {/* Pickup Address Section */}
      <h2 className="text-lg font-semibold mb-4"> Pickup Address</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2 relative">
          <label className="block text-sm text-gray-700 mb-1"></label>
          <input
            type="text"
            placeholder="  Search the Pickup Address"
            className="w-full p-2 border border-gray-300 rounded pl-10"
          />
          {/* Image icon inside input field */}
          <img
            src="search.jpg" // Replace with the image URL you want
            alt="Search Icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
        </div>
      </div>

      {/* Buyer Details Section */}
      <h2 className="text-lg font-semibold mb-4">Buyer Details</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Buyer's Name</label>
          <input
            type="text"
            placeholder="Enter Buyer's name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="Enter Phone number"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Alternate Phone number</label>
          <input
            type="text"
            placeholder="Enter Alternate number"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Email ID</label>
          <input
            type="email"
            placeholder="Enter email id"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Buyer Address</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Complete Address</label>
          <input
            type="text"
            placeholder="Enter the complete Address"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Land mark</label>
          <input
            type="text"
            placeholder="Enter land mark"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            placeholder="Enter Pincode"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">City</label>
          <input
            type="text"
            placeholder="Enter City"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">State</label>
          <input
            type="text"
            placeholder="Enter State"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Country</label>
          <input
            type="text"
            value="India"
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
      </div>

      {/* Optional Fields for Complete Name and GSTIN placed above Billing address checkbox */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Complete Name (Optional)</label>
          <input
            type="text"
            value={completeName}
            onChange={handleCompleteNameChange}
            placeholder="Enter Complete Name (Optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 mb-1">GSTIN Number (Optional)</label>
          <input
            type="text"
            value={gstin}
            onChange={handleGstinChange}
            placeholder="Enter GSTIN Number (Optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Billing address checkbox */}
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="billing-address"
          className="mr-2"
          onChange={(e) => onBillingAddressToggle(e.target.checked)}
        />
        <label htmlFor="billing-address" className="text-sm text-gray-700">
          Billing address same as shipping address
        </label>
      </div>
    </div>
  );
};









// DeliveryForm Component
const DeliveryForm = () => {
  return (
    <div className="bg-green-50 p-8 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Where is the order being delivered?</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Complete address</label>
            <input
              type="text"
              placeholder="House/Floor No, Building name or Street"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Landmark</label>
            <input
              type="text"
              placeholder="Enter Landmark"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Combined Pincode, City, State, and Country in one row */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              placeholder="Enter Pincode"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">State</label>
            <input
              type="text"
              placeholder="Enter State"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value="India"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};









// QuickShipment Component
const QuickShipment = () => {
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(false);

  const handleBillingAddressToggle = (checked) => {
    setIsBillingSameAsShipping(checked);
  };

  return (
    <div className="flex h-screen bg-green-50">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-green-50">
        <NavBar />

        {/* BuyerForm */}
        <BuyerForm onBillingAddressToggle={handleBillingAddressToggle} />

        {/* Conditionally render DeliveryForm if checkbox is checked */}
        {isBillingSameAsShipping && <DeliveryForm />}

        {/* Always render OrderForm */}
        <OrderForm />

        {/* Render Next button at the bottom inside the content */}
        <div className="flex justify-end mt-6 p-4 bg-white shadow-md">
          <button className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickShipment;