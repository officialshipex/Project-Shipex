import React, { useState } from 'react';
import Logo from "../assets/track/Group.png";
import Illustration from "../assets/track/Illustration.png";
import Buyer from "../assets/track/buyer.png";
import Seller from "../assets/track/seller.png";
import Location from "../assets/track/location.png";
import Partners from "../assets/track/partners.png";
import Join from "../assets/track/join.png";
import Shipments from "../assets/track/shipments.png";


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
            <div className="flex flex-col lg:flex-row items-center lg:justify-around p-4 lg:p-8 px-2 sm:px-12 lg:px-16 bg-white min-h-screen">
                {/* Left section */}
                <div className="lg:w-1/3 w-full space-y-5 text-center lg:text-left mb-8 lg:mb-0">
                    <img src={Logo} alt="Logo" className="mx-auto lg:mx-0 w-28 lg:w-32" />
                    <h1 className="text-md lg:text-lg font-bold text-green-600">Become a Part of ShipEx</h1>
                    <p className="text-gray-600 text-sm lg:text-base px-4 lg:px-0">
                        Register now to experience hassle-free shipping, reliable logistics, and dedicated support for your business needs. Unlock the potential for growth and efficiency in your operations.
                    </p>
                    <ul className="space-y-4 text-gray-700 px-3 lg:px-0 w-full lg:w-[88%]">
                        <li className="flex items-center gap-3">
                            <img src={Location} alt="location" className="w-8" />
                            <p className="text-sm text-left">Ship anywhere in India with our nationwide delivery network</p>
                        </li>
                        <li className="flex items-center gap-3">
                            <img src={Partners} alt="partners" className="w-8" />
                            <p className="text-sm text-left">We have 25+ partners for all your shipping needs.</p>
                        </li>
                        <li className="flex items-center gap-3">
                            <img src={Join} alt="join" className="w-8" />
                            <p className="text-sm text-left">Join 20,000+ sellers using our trusted logistics</p>
                        </li>
                        <li className="flex items-center gap-3">
                            <img src={Shipments} alt="shipments" className="w-8" />
                            <p className="text-sm text-left">We handle 50,000+ daily shipments efficiently</p>
                        </li>
                    </ul>
                    <img src={Illustration} alt="illustration" className="w-[60%] h-[40%] mx-auto lg:mx-0" />
                </div>

                {/* Right section */}
                <div className="lg:w-1/2 xl:w-1/3 w-full bg-green-50 border-green-200 border-[1px] p-4 lg:p-5 rounded-lg shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        {/* Seller Radio Button */}
                        <label className={`flex items-center space-x-2 border-[2px] border-green-600 h-16 w-full sm:w-56 gap-1 p-2 rounded-md ${role === "seller" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>
                            <img src={Seller} alt="seller" className="w-8" />
                            <div>
                                <p className='text-[12px] font-bold tracking-wider'>I am Seller</p>
                                <p className='text-[8px] font-bold'>I sell products online</p>
                            </div>
                            <input
                                type="radio"
                                name="role"
                                value="seller"
                                className="hidden"
                                onChange={handleRoleChange} // Call role change handler
                                checked={role === "seller"}
                            />
                        </label>

                        {/* Buyer Radio Button */}
                        <label className={`flex items-center space-x-2 border-[2px] border-green-600 h-16 w-full sm:w-56 gap-1 p-2 rounded-md ${role === "buyer" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>
                            <img src={Buyer} alt="buyer" className="w-8" />
                            <div>
                                <p className='text-[12px] font-bold tracking-wider'>I am Buyer</p>
                                <p className='text-[8px] font-bold'>I want to track my order</p>
                            </div>
                            <input
                                type="radio"
                                name="role"
                                value="buyer"
                                className="hidden"
                                onChange={handleRoleChange} // Call role change handler
                                checked={role === "buyer"}
                            />
                        </label>
                    </div>

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
                </div>
            </div>

        </>
    );
};

export default TrackByNumber;













