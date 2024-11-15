import React, { useState } from 'react';

const TrackByNumber = () => {
    const [trackBy, setTrackBy] = useState("mobile"); // Default is mobile
    const [role, setRole] = useState("buyer"); // Default role is buyer

    const handleTrackByChange = (e) => {
        setTrackBy(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const getPlaceholder = () => {
        switch (trackBy) {
            case "awb":
                return "Enter your Airway Bill Number (AWB)";
            case "orderId":
                return "Enter your Order ID to track your orders";
            default:
                return "Enter your Mobile number to track your orders";
        }
    };

    const getButtonText = () => {
        switch (trackBy) {
            case "awb":
            case "orderId":
                return "Track Order";
            default:
                return "Send OTP";
        }
    };

    return (
        <>


            <form className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-12">
                    <div>
                        <label className='font-bold text-[14px]'>Track by:</label>
                    </div>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0'>
                        {/* Mobile Radio Button */}
                        <label className={`flex items-center cursor-pointer ${trackBy === "mobile" ? "text-green-600" : "text-gray-700"}`}>
                            <input
                                type="radio"
                                name="trackBy"
                                value="mobile"
                                className="hidden"
                                checked={trackBy === "mobile"}
                                onChange={handleTrackByChange}
                            />
                            <span className={`h-5 w-5 border-2 border-green-600 rounded-full flex items-center justify-center ${trackBy === "mobile" ? "bg-green-600" : "bg-white"}`}></span>
                            <span className="ml-2 text-[13px] font-bold">Mobile Number</span>
                        </label>

                        {/* AWB Radio Button */}
                        <label className={`flex items-center cursor-pointer ${trackBy === "awb" ? "text-green-600" : "text-gray-700"}`}>
                            <input
                                type="radio"
                                name="trackBy"
                                value="awb"
                                className="hidden"
                                checked={trackBy === "awb"}
                                onChange={handleTrackByChange}
                            />
                            <span className={`h-5 w-5 border-2 border-green-600 rounded-full flex items-center justify-center ${trackBy === "awb" ? "bg-green-600" : "bg-white"}`}></span>
                            <span className="ml-2 text-[13px] font-bold">AWB</span>
                        </label>

                        {/* Order ID Radio Button */}
                        <label className={`flex items-center cursor-pointer ${trackBy === "orderId" ? "text-green-600" : "text-gray-700"}`}>
                            <input
                                type="radio"
                                name="trackBy"
                                value="orderId"
                                className="hidden"
                                checked={trackBy === "orderId"}
                                onChange={handleTrackByChange}
                            />
                            <span className={`h-5 w-5 border-2 border-green-600 rounded-full flex items-center justify-center ${trackBy === "orderId" ? "bg-green-600" : "bg-white"}`}></span>
                            <span className="ml-2 text-[13px] font-bold">Order ID</span>
                        </label>
                    </div>
                </div>

                {/* Input fields for Mobile Number and AWB */}
                {trackBy === "mobile" && (
                    <>
                        <input
                            type="text"
                            placeholder={getPlaceholder()}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                        <p className="text-gray-600 text-[11px] font-semibold">
                            Click 'Verify OTP' to sign up with <span className='font-bold text-black'>Shipex</span> while Accepting our <a href="#" className='text-green-500'>Terms and conditions.</a>
                        </p>
                        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
                            {getButtonText()}
                        </button>
                        <p className="text-gray-600 text-[13px] font-semibold mt-2">
                            We will redirected to MyShipex to track your order.
                        </p>
                    </>
                )}

                {trackBy === "awb" && (
                    <input
                        type="text"
                        placeholder={getPlaceholder()}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    />
                )}

                {trackBy === "orderId" && (
                    <>
                        <input
                            type="text"
                            placeholder="Order ID"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Phone number / Email ID"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                    </>
                )}

                {trackBy !== "mobile" && (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
                        {getButtonText()}
                    </button>
                )}
            </form>

            <p className="text-sm text-black-500 mt-4 text-center lg:text-left font-bold">
                Can't Find Your Order Details?
            </p>
            <p className="text-[12.5px] text-gray-500 mt-2 text-center lg:text-left">
                We sent your AWB tracking number to you via Email and SMS upon confirmation of your order.
            </p>

        </>
    );
};

export default TrackByNumber;













