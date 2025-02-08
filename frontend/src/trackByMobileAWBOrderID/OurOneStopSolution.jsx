import React from 'react';
import DirectToConsumer from "../assets/landingpage/directtoconsumers.png";
import MarketPlaceSellers from "../assets/landingpage/marketplacestore.png";
import SocialSellers from "../assets/landingpage/socialsellers.png";
import Manufactures from "../assets/landingpage/manufactures.png";
import ServiceProviders from "../assets/landingpage/serviceproviders.png";
import SmallAndMediumEnterprise from "../assets/landingpage/smallandmedium.png";
// import UnderOurSolution from "../assets/track/underoursolution.png";

const OurOneStopSolutions = () => {
    return (
        <div className='bg-gradient-to-r from-purple-100 to-white'>
            <h1 className='md:text-5xl text-4xl font-extrabold p-5 md:px-44'>Our <span className="text-4xl md:text-5xl font-extrabold mt-5 bg-gradient-to-r from-purple-400 via-purple-800 to-black bg-clip-text text-transparent">Services</span></h1>
            <div className="flex flex-col items-center p-6 sm:p-8 lg:px-8">
                {/* Solutions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:max-w-[82%]">

                    {/* Solution 01 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={DirectToConsumer}
                                alt="D2C Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Direct-to-Consumer (D2C)</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            Seamless integration, enhanced efficiency, value-added services, and user-friendly platform for global shipments.
                        </p>
                    </div>

                    {/* Solution 02 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={MarketPlaceSellers}
                                alt="Marketplace Sellers Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Marketplace Sellers</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            Easy integrations, multiple pickup and delivery locations, efficient order processing, global shipping.
                        </p>
                    </div>

                    {/* Solution 03 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={SocialSellers}
                                alt="Social Sellers Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Social Sellers</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            No fees, COD facility, reliable tracking, and global shipping.
                        </p>
                    </div>

                    {/* Solution 04 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={Manufactures}
                                alt="Manufacturers Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Manufacturers</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            Platform integrations, efficient processing, and wide-reaching global shipping capabilities.
                        </p>
                    </div>

                    {/* Solution 05 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={ServiceProviders}
                                alt="Service Providers Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Service Providers</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            Marketplace integrations, multi-location pickup and delivery, efficient order processing, global reach.
                        </p>
                    </div>

                    {/* Solution 06 */}
                    <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                        {/* Icon with circle background */}
                        <div className="bg-white rounded-full p-3">
                            <img
                                src={SmallAndMediumEnterprise}
                                alt="SMEs Icon"
                                className="w-5 h-5"
                            />
                        </div>
                        {/* Heading */}
                        <h4 className="font-bold text-lg text-center lg:text-left">Small & Medium Enterprises (SMEs)</h4>
                        {/* Paragraph */}
                        <p className="text-gray-600 text-center lg:text-left text-sm">
                            Multi-channel integrations, buyer notifications, multiple pickup locations, 24/7 global shipping.
                        </p>
                    </div>

                </div>



            </div>
        </div>
    );
};

export default OurOneStopSolutions;


