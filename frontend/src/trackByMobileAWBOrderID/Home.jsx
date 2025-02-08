import React from "react";
import Logo from "../assets/LOGO.svg";
import Home1 from "../assets/landingpage/home1.png";
import Home2 from "../assets/landingpage/home2.png";

const Home = () => {
    return (
        <div className="relative bg-gradient-to-r from-purple-100 to-white min-h-screen">
            {/* Navbar */}
            <nav className="w-full py-8 px-6 md:px-16 lg:px-24 flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-700 w-24">
                    <img src={Logo} alt="Logo" />
                </div>
                <button className="bg-[#280847] text-[#F7CE23] px-10 md:px-12 lg:px-16 py-3 rounded-md font-medium hover:bg-[#3a284a] transition">
                    Login
                </button>
            </nav>

            {/* Main Section */}
            <div className="py-5 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-center gap-14">
                {/* Left Side Content */}
                <div className="md:w-[60%] lg:w-[45%] space-y-6 text-center md:text-left">
                    <div className="bg-white md:px-8 lg:px-10 md:py-8 lg:py-10 px-5 py-5 rounded-lg shadow-lg">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                            Fulfill your vision with
                        </h1>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-5 bg-gradient-to-r from-purple-400 via-black to-black bg-clip-text text-transparent">
                            ShipexIndia
                        </h1>

                        <p className="text-gray-600 text-md md:text-lg mt-5 mb-5">
                            India’s Premier Logistics Partner for Faster, Reliable, and Cost-Effective Shipping Solutions.
                        </p>
                        <button className="bg-[#280847] text-[#F7CE23] px-10 md:px-12 lg:px-16 py-3 rounded-md font-medium hover:bg-[#3a284a] transition">
                            Get Started
                        </button>
                    </div>

                    {/* Buttons Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <button className="flex items-center justify-center gap-3 sm:gap-5 text-md md:text-lg lg:text-xl bg-white px-6 py-4 rounded-lg text-black font-bold hover:bg-purple-100 transition sm:col-span-2">
                            Track Shipment
                            <span className="material-symbols-outlined text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                                arrow_circle_right
                            </span>
                        </button>
                        <button className="flex items-center justify-center gap-3 sm:gap-5 text-md md:text-lg lg:text-xl bg-white px-6 py-4 rounded-lg text-black font-bold hover:bg-purple-100 transition sm:col-span-2">
                            Contact us
                            <span className="material-symbols-outlined text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                                arrow_circle_right
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right Side Images - Improved Tablet View */}
                <div className="relative w-full md:w-[50%] lg:w-[45%] flex justify-center md:justify-end mt-12 md:mt-0 hidden sm:flex">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        {/* Main Image */}
                        <img src={Home1} alt="Delivery Person" className="rounded-xl shadow-lg md:w-[300px] lg:w-[400px] w-[200px]" />

                        {/* Overlay Image */}
                        <img
                            src={Home2}
                            alt="Female Delivery"
                            className="absolute bottom-[-40px] right-[10px] sm:right-[-40px] md:right-[-20px] lg:right-[70px] lg:top-[250px] w-[40%] sm:w-[35%] md:w-[55%] lg:w-[40%] rounded-xl shadow-lg border-4 border-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
