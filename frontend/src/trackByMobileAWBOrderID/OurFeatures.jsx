import React from "react";
import Clock from "../assets/landingpage/clock.png";
import Dashed from "../assets/landingpage/dashed.png";
import File from "../assets/landingpage/file.png";
import Internet from "../assets/landingpage/internet.png";
import Man from "../assets/landingpage/man.png";
import Vehicle from "../assets/landingpage/vehicle.png";

const Features = () => {
    const features = [
        "Multifunctional Dashboard",
        "Billing & Weight Reconciliation",
        "Multiple Pickup Locations",
        "Insurance Coverage",
        "API Integration",
        "Pin code Serviceability",
        "E-mail, WhatsApp, SMS Notification",
    ];

    return (
        <div className="max-w-full mx-auto px-6 md:px-12 lg:px-32 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-purple-100 to-white">
            
            {/* Left Side */}
            <div className="p-6 w-full max-w-xs mx-auto md:mx-0 relative">
                {features.map((feature, index) => (
                    <div key={index} className="relative flex items-start space-x-3 py-3">
                        <span className={`text-2xl font-extrabold ${index === 0 ? 'text-purple-600' : 'text-gray-300'}`}>
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col">
                            <span className={`text-lg font-semibold ${index === 0 ? 'text-black' : 'text-gray-500'}`}>{feature}</span>
                            {index !== features.length - 1 && (
                                <div className="w-1 h-8 bg-gray-300 ml-2"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section */}
            <div className="px-4 md:px-0">
                {[
                    { title: "Multifunctional Dashboard", desc: "All-in-one dashboard: Manage & track shipments, gain insights in real-time." },
                    { title: "Billing & Weight Reconciliation", desc: "Skip the paperwork: Automated billing & weight reconciliation for a smooth financial experience." },
                    { title: "Multiple Pickup Location", desc: "Ship from anywhere: Schedule pickups at multiple locations for ultimate convenience." },
                    { title: "Insurance Coverage", desc: "Ship with peace of mind: Protect your valuables with Shipex India's insurance." },
                    { title: "API Integration", desc: "Automate your shipping: Seamless API Integration." }
                ].map((item, index) => (
                    <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md mt-4">
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Right Side: Icons and Dashed Line (Hidden in Mobile View) */}
            <div className="relative flex-col items-center mt-8 md:mt-0 hidden md:flex">
                <img src={Dashed} alt="Dashed Line" className="absolute top-0 h-[700px]" />
                <img src={Clock} alt="Feature 1" className="w-20 mb-6 mt-[-32px] mr-[150px] relative" />
                <img src={Internet} alt="Feature 2" className="w-20 mt-[100px] mr-[270px] relative" />
                <img src={File} alt="Feature 3" className="w-20 mt-[100px] mr-[-280px] relative" />
                <img src={Vehicle} alt="Feature 4" className="w-20 mt-[50px] mr-[100px] relative" />
                <img src={Man} alt="Feature 5" className="w-20 mt-[70px] mr-[-150px] relative" />
            </div>
        </div>
    );
};

export default Features;
