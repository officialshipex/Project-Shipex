import React from 'react';

const UniqueFeatures = () => {
    return (
        <div className="flex flex-col items-center py-8 px-4 sm:px-12 lg:px-24 bg-gray-100 min-h-[50vh]">
            {/* Heading Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">What Makes Us <span className="text-green-600">Unique</span></h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 mt-2">
                    Enterprise to Social sellers, We provide the best rates and services for logistics solutions to businesses of all sizes.
                </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-11/12 p-3">
                {/* Feature 01 */}
                <div className="relative bg-white border border-green-100 rounded-lg p-6 shadow-lg h-auto transition-transform hover:scale-105 duration-200 ease-in-out">
                    <h3 className="absolute top-[-20px] left-[-20px] text-green-600 text-4xl lg:text-5xl font-bold">01</h3>
                    <h4 className="font-bold text-lg lg:text-xl mb-2">Multifunctional Dashboard</h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                        All-in-one dashboard: Manage & track shipments, gain insights in real-time.
                    </p>
                </div>

                {/* Feature 02 */}
                <div className="relative bg-white border border-green-100 rounded-lg p-6 shadow-lg h-auto transition-transform hover:scale-105 duration-200 ease-in-out">
                    <h3 className="absolute top-[-20px] left-[-20px] text-green-600 text-4xl lg:text-5xl font-bold">02</h3>
                    <h4 className="font-bold text-lg lg:text-xl mb-2">Billing & Weight Reconciliation</h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                        Skip the paperwork: Automated billing & weight reconciliation for a smooth financial experience.
                    </p>
                </div>

                {/* Feature 03 */}
                <div className="relative bg-white border border-green-100 rounded-lg p-6 shadow-lg h-auto transition-transform hover:scale-105 duration-200 ease-in-out">
                    <h3 className="absolute top-[-20px] left-[-20px] text-green-600 text-4xl lg:text-5xl font-bold">03</h3>
                    <h4 className="font-bold text-lg lg:text-xl mb-2">Multiple Pickup Locations</h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                        Ship from anywhere: Schedule pickups at multiple locations for ultimate convenience.
                    </p>
                </div>

                {/* Feature 04 */}
                <div className="relative bg-white border border-green-100 rounded-lg p-6 shadow-lg h-auto transition-transform hover:scale-105 duration-200 ease-in-out">
                    <h3 className="absolute top-[-20px] left-[-20px] text-green-600 text-4xl lg:text-5xl font-bold">04</h3>
                    <h4 className="font-bold text-lg lg:text-xl mb-2">Insurance Coverage</h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                        Ship with confidence: Protect your valuable shipments with insurance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UniqueFeatures;

