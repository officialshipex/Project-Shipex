import React, { useState } from 'react';
import Sidebar from '../components/Common/SideBar';
import Navbar from '../components/Common/NavBar';
import { FaPlus, FaTimes } from 'react-icons/fa';
import GeneralInformation from './GeneralInformation';
import PinCodes from './PinCodes';
import axios from 'axios';

const CourierShipRocket = () => {
    // State to manage sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State variables for each input field
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [courierName, setCourierName] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [isPass, setIsPass] = useState(true);
    const [isCourier, setIsCourier] = useState(true);

    const handleSubmit = async () => {
        if (!email) {
            setIsEmail(false);
        } else if (!password) {
            setIsPass(false);
        } else if (!courierName) {
            setIsCourier(false);
        } else {
            try {
                // Await the axios post request
                const response = await axios.post("http://localhost:5000/v1/couriers/shiprocket", {
                    email,
                    password,
                    courierName,
                });
                
                // Log the response data
                console.log(response.data   ); // Use response.data to access the returned data
                setIsCourier(true);
                setIsEmail(true);
                setIsPass(true);
            } catch (error) {
                // console.error("Error logging in:", error.message); // Catch and log any errors
                alert("please enter valid credentials")
            }
        }
    };

    const handleCourierName = (courierName) => {
        setCourierName(courierName);
    };

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Check if all fields are filled
    const isFormValid = email && password && courierName;

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div className={`bg-gray-200 h-screen fixed top-0 left-0 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <Sidebar />
                </div>

                {/* Main content */}
                <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-16' : 'ml-0'} transition-margin duration-300 md:ml-16`}>
                    {/* Navbar */}
                    <div className="w-full flex items-center justify-between p-4 bg-white shadow-md">
                        <button className="md:hidden" onClick={toggleSidebar}>
                            {isSidebarOpen ? (
                                <FaTimes className="text-gray-700" />
                            ) : (
                                <FaPlus className="text-gray-700" />
                            )}
                        </button>
                        <Navbar />
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 flex flex-col p-4 space-y-6 bg-gray-50 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Left Section */}
                            <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
                                <h2 className="text-lg font-bold mb-2">Shiprocket</h2>
                                <p className="text-sm mb-2 font-semibold">
                                    Use the following instructions to integrate your Shiprocket Account Credentials:
                                </p>
                                <p className="text-sm mb-2 font-semibold">
                                    Enter your following Credentials
                                </p>
                                <ul className="text-sm list-disc ml-4 mb-2 border-b pb-6">
                                    <li>Email</li>
                                    <li>Password</li>
                                </ul>

                                <ul className="text-sm list-disc ml-4 mb-2">
                                    <li>For more information please contact your DTDC Surface domestic account number.</li>
                                    <li>To use Shipex Serviceability please click on the Shipex Serviceability field.</li>
                                    <li>To use your Pincode Serviceability download the attached sample file and upload the final sheet.</li>
                                </ul>
                            </div>

                            {/* Right Section */}
                            <div className="col-span-2 space-y-4">
                                {/* General Information */}
                                <GeneralInformation fun={handleCourierName}/>

                                {/* Pincodes Section */}
                                <PinCodes />

                                {/* Sellers Panel */}
                                <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Sellers Panel</h2>

                                    <p className="text-gray-600 text-sm mb-4">
                                        Please provide below given Credentials for Shiprocket
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Email Field */}
                                        <div>
                                            <label className="text-sm block mb-1">Email</label>
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                value={email} // Bind the value
                                                onChange={(e) => setEmail(e.target.value)} // Update email state
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            <p className='text-red-500 text-[10px]'>{isEmail ? "" : "Email is required"}</p>
                                        </div>
                                        {/* Password Field */}
                                        <div>
                                            <label className="text-sm block mb-1">Password</label>
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                value={password} // Bind the value
                                                onChange={(e) => setPassword(e.target.value)} // Update password state
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            <p className='text-red-500'>{isPass ? "" : "Password is required"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-center mt-4 mb-12">
                                    <button
                                        className={`bg-green-500 text-white px-14 py-3 rounded-md w-full md:w-auto ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleSubmit}
                                        disabled={!isFormValid} // Disable button if form is invalid
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourierShipRocket;
