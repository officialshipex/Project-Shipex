import React from "react";
import BlueDart from "../assets/track/bluedart.png";
import Amazon from "../assets/track/amazon.png";
import Ebay from "../assets/track/ebay.png";
import BigCommerce from "../assets/track/bigcommerce.png";
import IndiaMart from "../assets/track/indiamart.png";
import InstaMojo from "../assets/track/instamojo.png";
import WooCommerce from "../assets/track/woocommerce.png";
import Shopify from "../assets/track/shopify.png";
import Xgati from "../assets/track/xgati.png";
import Dhl from "../assets/track/dhl.png";
import EcoExpress from "../assets/track/ecomexpress.png";
import ShadowFax from "../assets/track/shadowfax.png";
import XpressBees from "../assets/track/xpressbees.png";
import Delhivery from "../assets/track/delhivery.png";

const PartnersSection = () => {
    return (
        <div className="bg-gray-100 pt-7">
            <div className="container mx-auto px-4 sm:px-6 lg:px-44">

                {/* Partners Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0 lg:space-x-8">
                    
                    {/* Logo Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center justify-center w-full">
                        {/* Partner logos */}
                        {[BlueDart, Amazon, Ebay, BigCommerce, IndiaMart, InstaMojo, WooCommerce, Shopify, Xgati, Dhl, EcoExpress, ShadowFax, XpressBees, Delhivery].map((logo, index) => (
                            <div key={index} className="p-2 flex justify-center">
                                <img src={logo} alt={`partner-${index}`} className="h-12 sm:h-16 lg:h-20 object-contain" />
                            </div>
                        ))}
                    </div>

                    {/* Partners Info Section */}
                    <div className="lg:w-1/2 text-center lg:text-left lg:space-y-6">
                        <h3 className="text-3xl sm:text-4xl font-bold">Our <span className="text-green-600">Partners</span></h3>
                        <p className="text-gray-500 mt-2 text-sm sm:text-base lg:text-lg">
                            ShipEx offers efficient logistics solutions with multi-channel integrations and real-time tracking for reliable deliveries.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-12 bg-gradient-to-r from-[#0CBB7D] to-[#054F35] text-white rounded-md p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center">
                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Come Join Our Community To Deliver Memories</h4>
                    <button className="bg-[#0CBB7D] text-white px-6 py-3 sm:px-10 sm:py-4 rounded-md font-semibold mt-4 text-sm sm:text-base">
                        Sign up
                    </button>
                </div>

            </div>

            {/* Footer Section */}
            <div className="bg-black text-white text-center py-4 mt-8">
                <p className="text-xs sm:text-sm lg:text-base">Copyright © 2024 ShipEx. All rights reserved.</p>
            </div>
        </div>
    );
};

export default PartnersSection;

