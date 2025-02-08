import React from "react";
import WhyChoseus from "../assets/landingpage/whychoseus.png"

const WhyChooseUs = () => {
  return (
    <div className="px-6 sm:px-12 md:px-16 py-12 bg-white">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-black sm:px-16 md:px-24">
        Why Choose <span className="text-purple-600">Us ?</span>
      </h2>

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row md:flex-row items-center justify-center sm:gap-24 md:gap-32 mt-8">
        
        {/* Left Content Section */}
        <div className="sm:w-[550px] md:w-[700px]">
          <div className="bg-gradient-to-r from-purple-200 to-orange-50 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black">
              Early COD Remittance @0%
            </h3>
            <p className="text-gray-700 text-sm mt-3">
              Shipex India boosts your business by improving cash flow with the Early COD Remittance feature. This service lets you receive Cash on Delivery (COD) payments faster than the usual industry timelines, without any extra cost. This approach helps speed up your revenue cycle and enhances your financial flexibility.
            </p>

            {/* Benefits List */}
            <h4 className="text-2xl font-extrabold text-black mt-4">Benefits</h4>
            <ul className="text-gray-700 text-sm mt-2 space-y-2">
              <li><span className="font-bold text-gray-800">Improved Cash Flow :</span> Access funds from COD shipments faster, enhancing your financial liquidity.</li>
              <li><span className="font-bold text-gray-800">Cost Savings :</span> Eliminate additional charges for early COD remittance, maximizing your profitability.</li>
              <li><span className="font-bold text-gray-800">Enhanced Customer Experience :</span> Deliver a seamless experience to your customers with faster COD remittance.</li>
            </ul>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="sm:w-[300px] md:w-[250px] flex justify-center mt-8 md:mt-0">
          <img src={WhyChoseus} alt="COD Remittance" className="w-[250px] sm:w-[280px] md:w-[220px] max-w-sm md:max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
