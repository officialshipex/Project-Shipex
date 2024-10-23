import React, { useState } from 'react';
import Sidebar from '../components/Common/SideBar';
import Navbar from '../components/Common/NavBar';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa'; // Importing plus and times icons
import GeneralInformationB2B from './GeneralInformationB2B';



const CourierOxyzenExpressB2B = () => {
    // State to manage sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isShipexEnabled, setIsShipexEnabled] = useState(false);

    // Function to toggle Pincodes switch
    const toggleShipex = () => {
        setIsShipexEnabled(!isShipexEnabled);
    };


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
                                <h2 className="text-lg font-bold mb-2">Oxyzen Express</h2>
                                <p className="text-sm mb-2 font-semibold">
                                    Use the following instructions to integrate your Oxyzen Account Credentials:
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
                                    <li>To use your Pincode Serviceability download the attached sample file and upload the final sheet</li>

                                </ul>
                            </div>

                            {/* Right Section */}
                            <div className="col-span-2 space-y-4">

                                {/* General Information */}
                                <GeneralInformationB2B />

                                {/* Pincodes Section */}
                                <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Pincodes</h2>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm">Use Shipex pincodes</label>

                                        {/* Switch Implementation */}
                                        <div
                                            className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in"
                                            onClick={toggleShipex}
                                        >
                                            <input
                                                type="checkbox"
                                                name="toggle"
                                                id="toggle"
                                                className="sr-only"
                                                checked={isShipexEnabled}
                                                onChange={toggleShipex}
                                            />
                                            <div
                                                className={`block w-14 h-8 rounded-full ${isShipexEnabled ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}
                                            ></div>
                                            <div
                                                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isShipexEnabled ? 'translate-x-6' : ''
                                                    }`}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm">
                                        To use Shipex India serviceability, please enable the Shipex pincodes or upload your sheets.
                                    </p>
                                </div>



                                <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
                                    <h2 className="text-lg font-semibold mb-1">Prefetch AWB</h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Share and upload the AWBs you have received from Courier
                                    </p>
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                                        <div className="text-sm text-gray-700">Upload new file</div>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex justify-center items-center bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md cursor-pointer">
                                                <FaUpload className="mr-2" /> {/* Add upload icon here */}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                />
                                                <span className="text-green-500">Upload</span>
                                            </label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-blue-500 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8.707 13.707a1 1 0 01-1.414 0L4 10.414V13a1 1 0 11-2 0v-5a1 1 0 011-1h5a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414zM10 17a1 1 0 100-2h8a1 1 0 100 2h-8z" clipRule="evenodd" />
                                        </svg>
                                        Download Sample File
                                    </a>
                                </div>



                                {/* Sellers Panel */}
                                <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Sellers Panel</h2>

                                    <p className="text-gray-600 text-sm mb-4">
                                        Please provide below given Credentials for Oxyzen
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Email', type: 'text', placeholder: 'Email' },
                                            { label: 'Password', type: 'password', placeholder: 'Password' },
                                        ].map(({ label, type, placeholder }, index) => (
                                            <div key={index}>
                                                <label className="text-sm block mb-1">{label}</label>
                                                <input
                                                    type={type}
                                                    placeholder={placeholder}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-center mt-4 mb-12">
                                    <button className="bg-green-500 text-white px-14 py-3 rounded-md w-full md:w-auto">
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

export default CourierOxyzenExpressB2B;

