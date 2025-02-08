import React from "react";
import aboutImage from "../assets/landingpage/aboutus.png"; // Replace with actual image path
import Location from "../assets/landingpage/location.png";
import Storefront from "../assets/landingpage/storefront.png";
import Handshake from "../assets/landingpage/handshake.png";
import LocalShipping from "../assets/landingpage/localshiping.png";

const AboutUs = () => {
  return (
    <div className="px-6 md:px-16 py-12 bg-white">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 md:px-28">
        About <span className="text-purple-600">Us</span>
      </h2>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:gap-48">
        
        {/* Left Image Section - Hidden on small screens */}
        <div className="hidden md:flex justify-center">
          <img src={aboutImage} alt="About Us" className="w-full max-w-sm md:max-w-md" />
        </div>

        {/* Right Content Section */}
        <div className="lg:w-[600px] mt-8 md:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Item 1 */}
            <div className="flex items-start flex-col gap-4">
              <img src={Location} alt="Pincode Coverage" className="w-6 h-8" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">29K+ Pincodes</h3>
                <p className="text-gray-600 text-sm">
                  With coverage across 29,000+ pincodes, we ensure your shipments reach every corner of India.
                </p>
              </div>
              <hr className="border-purple-500 mt-2 w-full border-[2px]" />
            </div>

            {/* Item 2 */}
            <div className="flex items-start flex-col gap-4">
              <img src={Handshake} alt="Shipping Partners" className="w-6 h-8" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">25+ Shipping Partner</h3>
                <p className="text-gray-600 text-sm">
                  With 25+ shipping partners, we offer tailored solutions for speed, efficiency, and reliability.
                </p>
              </div>
              <hr className="border-purple-500 mt-2 w-full border-[2px]" />
            </div>

            {/* Item 3 */}
            <div className="flex items-start flex-col gap-4">
              <img src={Storefront} alt="Sellers" className="w-6 h-8" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">20K+ Sellers</h3>
                <p className="text-gray-600 text-sm">
                  Over 20,000+ sellers trust us for seamless deliveries, empowering businesses of all sizes.
                </p>
              </div>
              <hr className="border-purple-500 mt-2 w-full border-[2px]" />
            </div>

            {/* Item 4 */}
            <div className="flex items-start flex-col gap-4">
              <img src={LocalShipping} alt="Daily Shipments" className="w-6 h-8" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">50K+ Daily Shipment</h3>
                <p className="text-gray-600 text-sm">
                  With 50,000+ daily shipments, we ensure efficient logistics for seamless shipping management.
                </p>
              </div>
              <hr className="border-purple-500 mt-2 w-full border-[2px]" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
