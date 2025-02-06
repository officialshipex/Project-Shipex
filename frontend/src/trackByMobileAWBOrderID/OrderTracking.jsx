import React from "react";

const OrderTracking = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center px-6 sm:px-12 md:px-16 py-12 bg-purple-50 gap-5 sm:gap-20 md:gap-44">
      
      {/* Left Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          Track your <br />
          <span className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent">
            Orders Easily
          </span>
        </h1>
        <p className="text-gray-600 text-lg mt-4">
          Enter your AWB Number to track your order
        </p>
      </div>

      {/* Right Section */}
      <div className="mt-10 sm:mt-0 flex justify-center w-full sm:w-[450px] md:w-[500px]">
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-md font-semibold text-gray-800">
            Track your order by entering the AWB Number
          </h2>
          
          <input
            type="text"
            placeholder="Enter the AWB Number"
            className="w-full border border-gray-300 px-4 py-3 mt-4 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <button className="w-full bg-[#280847] text-[#F7CE23] py-2 mt-4 rounded-md font-semibold hover:bg-[#3a284a] transition">
            Track
          </button>

          <hr className="my-4 border-gray-300" />

          <p className="text-gray-600 text-sm">
            <strong>Can’t Find Your Order Details?</strong> <br />
            We sent your AWB tracking number to you via Email and SMS upon confirmation of your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
