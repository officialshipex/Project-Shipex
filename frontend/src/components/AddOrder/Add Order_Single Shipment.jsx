import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";


function AddressSelection() {
    const [selectedAddress, setSelectedAddress] = useState('');

    const primaryAddress = '129 Vidya nagar, Bhiwani Haryana India';
    const moreAddresses = [
        '129 Vidya nagar, Bhiwani Haryana India',
        '129 Vidya nagar, Bhiwani Haryana India',
        '129 Vidya nagar, Bhiwani Haryana India',
        '129 Vidya nagar, Bhiwani Haryana India',
    ];

    const handleSelect = (address) => {
        setSelectedAddress(address);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans text-left">
            {/* Primary Address Section */}
            <h3 className="text-lg font-semibold mb-4 text-left">Pick up Address</h3>
            <div className="border border-gray-300 p-4 rounded-lg mb-6 bg-gray-50 text-left">
                <h4 className="font-semibold mb-2 text-left">Primary</h4>
                <p className="mb-2 text-sm text-gray-600 text-left">{primaryAddress}</p>
                <button
                    onClick={() => handleSelect(primaryAddress)}
                    className="px-4 py-2 rounded bg-green-100 text-gray-600 hover:bg-green-200 text-left"
                >
                    Select
                </button>
            </div>

            {/* More Addresses Section */}
            <h3 className="text-lg font-semibold mb-4 text-left">More addresses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
                {moreAddresses.map((address, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-left"
                    >
                        <p className="mb-2 text-sm text-gray-600 text-left">{address}</p>
                        <button
                            onClick={() => handleSelect(address)}
                            className="w-full px-4 py-2 rounded bg-green-100 text-gray-600 hover:bg-green-200 text-left"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>

            {/* Back and Next Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
                <button className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 ml-4">Back</button>
                <button className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">Next</button>
            </div>
        </div>
    );
}




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
    <div className="bg-green-50 h-screen flex items-start justify-left px-6">
      <div className="bg-green-50 rounded-md p-8 w-full max-w-full h-full relative"> {/* Full width and height */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Package Details</h2>

        {/* Weight and Dimensions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> {/* Reduced gap */}
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
                className="w-32 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-r-md flex items-center justify-center">
                Kg
              </span>
            </div>
          </div>

          {/* Dimensions Input */}
          <div className="col-span-3">
            <label className="block text-gray-700 font-medium mb-2">Enter Dimensions</label>
            <div className="grid grid-cols-3 gap-2"> {/* Reduced gap between dimensions */}
              {["length", "breadth", "height"].map((dim) => (
                <div key={dim} className="flex">
                  <input
                    type="number"
                    name={dim}
                    value={dimensions[dim]}
                    onChange={handleInputChange}
                    placeholder={dim.charAt(0).toUpperCase()}
                    className="w-32 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
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

        {/* Buttons: Move to bottom-right */}
        <div className="absolute bottom-10 right-10 flex space-x-4">
          <button className="text-green-500 font-medium">Back</button>
          <button className="bg-green-500 text-white font-medium py-2 px-6 rounded-md hover:bg-green-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
  


const OrderForm = () => {
  return (
    <div className="min-h-screen bg-green-500 relative">
     <div className="bg-green-50 p-8 w-full min-h-screen">


        <h2 className="text-xl font-bold mb-6">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Order ID</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="13845738942"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Order Type</label>
            <select className="w-full border rounded-md p-2 focus:ring focus:ring-green-200">
              <option value="" disabled selected>
                Select
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Order Date</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
            />
          </div>
        </div>

        {/* Product Details Heading with Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Product Details</h2>
          <button className="bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-500 transition">
            Add Product
          </button>
        </div>

        {/* Product Details Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter Qty"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Unit Price</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter unit price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Product Category</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter product category"
            />
          </div>
        </div>

        {/* SKU, HSN, Tax Rate, and Discount on the next row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter SKU"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">HSN</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter HSN"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tax Rate</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter tax rate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Discount (Optional)</label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter discount"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Payment</h2>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center">
            <input type="radio" name="payment" className="mr-2" />
            COD
          </label>
          <label className="flex items-center">
            <input type="radio" name="payment" className="mr-2" />
            Prepaid
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Shipping</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter shipping"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gift Wrap</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter gift wrap details"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transaction</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter transaction"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Discount</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring focus:ring-green-200"
              placeholder="Enter discount"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-14 left-4 flex justify-between w-full px-4">
        {/* Left Side: Order Summary */}
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Sub-Total for products:</div>
          <div className="text-sm font-semibold">Other Changes:</div>
          <div className="text-sm font-semibold">Discount:</div>
          <div className="text-sm font-semibold">Total Order Value:</div>
        </div>
        {/* Right Side: Order Summary Values */}
        <div className="flex flex-col text-right">
          <div>0</div>
          <div>0</div>
          <div>0</div>
          <div>0</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
          Back
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md">
          Next
        </button>
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
            <label className="block text-gray-700 mb-1">Landmark <span className="text-gray-500">(Optional)</span></label>
            <input
              type="text"
              placeholder="Add nearby post office"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              placeholder="Enter Buyer's Pincode"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">State</label>
            <input
              type="text"
              placeholder="Enter your state"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              placeholder="Enter your Country"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
    <div className="bg-green-50 p-8 rounded-lg shadow-md w-full relative">
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

      {/* Next Button */}
      <div className="absolute bottom-8 right-8">
        <button
          type="button"
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
};






// Main AddStaff Component with ShipmentComponent Tabs
const AddStaff = () => {
  const [billingAddressSame, setBillingAddressSame] = useState(false);
  const [activeTab, setActiveTab] = useState("Single shipment");
  const [activeSubTab, setActiveSubTab] = useState("Buyer Details");
  const [selectedAddress, setSelectedAddress] = useState('');
  
  const mainTabs = ["Single shipment", "Bulk orders", "Quick Shipment", "B2B"];
  const subTabs = ["Buyer Details", "Pick up Address", "Order details", "Package Details"];

  const handleBillingAddressToggle = (checked) => {
    setBillingAddressSame(checked);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="p-4 flex-1 overflow-auto">
          {/* Main Tabs */}
          <div className="flex space-x-4 mb-4 bg-gray-100 p-2 rounded-md">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md ${
                  activeTab === tab ? 'bg-green-500 text-white' : 'bg-white text-gray-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Conditionally render Sub Tabs only for "Single shipment" */}
          {activeTab === "Single shipment" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{activeTab}</h2>
              <div className="flex space-x-4 border-b">
                {subTabs.map((subTab) => (
                  <button
                    key={subTab}
                    className={`pb-2 ${
                      activeSubTab === subTab
                        ? 'text-green-500 border-b-2 border-green-500'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveSubTab(subTab)}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* Content based on active sub-tab */}
              <div className="mt-4">
                {activeSubTab === "Buyer Details" && (
                  <>
                    <BuyerForm onBillingAddressToggle={handleBillingAddressToggle} />
                    {billingAddressSame && <DeliveryForm />}
                  </>
                )}
                {activeSubTab === "Pick up Address" && (
                  <AddressSelection
                    selectedAddress={selectedAddress}
                    onSelectAddress={handleSelectAddress}
                  />
                )}
                {activeSubTab === "Order details" && <OrderForm />}
                {activeSubTab === "Package Details" && <PackageDetailsForm />}
              </div>
            </div>
          )}

          {/* You can add the content for other tabs here, if necessary */}
          {activeTab !== "Single shipment" && (
            <div className="mt-4">
              {/* Content for Bulk orders, Quick Shipment, B2B */}
              <p>Select a sub-tab based on the context for the other tabs.</p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            {/* Next button content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
