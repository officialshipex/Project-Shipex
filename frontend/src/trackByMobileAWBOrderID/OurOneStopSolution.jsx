import React from 'react';
import DirectToConsumer from "../assets/track/directtoconsumers.png";
import MarketPlaceSellers from "../assets/track/marketplace sellers.png";
import SocialSellers from "../assets/track/social serllers.png";
import Manufactures from "../assets/track/manufactures.png";
import ServiceProviders from "../assets/track/service providers.png";
import SmallAndMediumEnterprise from "../assets/track/small and medium enterprise.png";
import UnderOurSolution from "../assets/track/underoursolution.png";

const OurOneStopSolutions = () => {
    return (
        <div className="flex flex-col items-center p-6 sm:p-8 lg:px-8 bg-white">
            {/* Container for Heading and Illustration */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-around w-full lg:max-w-[80%] mb-12">

                {/* Heading Section (Left Side) */}
                <div className="text-center lg:text-left lg:w-1/2">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        Our One Stop <span className="text-green-600">Solutions</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">
                        From large enterprises to individual social sellers, we offer exceptional rates and top-notch logistics service tailored for businesses of any size. Our solutions ensure efficient and cost-effective delivery, meeting the unique needs of each client.
                    </p>
                </div>

                {/* Illustration (Right Side) */}
                <div className="flex justify-center lg:justify-end lg:w-1/2 mt-8 lg:mt-0">
                    <img
                        src={UnderOurSolution}
                        alt="Illustration"
                        className="w-[250px] h-auto lg:w-[350px]"
                    />
                </div>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:max-w-[82%]">

                {/* Solution 01 */}
                <div className="flex flex-col items-center lg:items-start space-y-2 p-4">
                    {/* Icon with circle background */}
                    <div className="bg-gray-100 rounded-full p-3">
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
                    <div className="bg-gray-100 rounded-full p-3">
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
                    <div className="bg-gray-100 rounded-full p-3">
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
                    <div className="bg-gray-100 rounded-full p-3">
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
                    <div className="bg-gray-100 rounded-full p-3">
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
                    <div className="bg-gray-100 rounded-full p-3">
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
    );
};

export default OurOneStopSolutions;


