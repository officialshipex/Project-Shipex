import React, { useState } from 'react';
import Sidebar from '../components/Common/SideBar';
import Navbar from '../components/Common/NavBar';
import { FaPlus, FaTimes } from 'react-icons/fa'; // Importing plus and times icons
import GeneralInformation from './GeneralInformation';
import DTDCsurface from './DTDCsurface';
import PinCodes from './PinCodes';
import PreFetechAWB from './PreFetechAWB';
import Seller from './Seller';


const CourierDTDC = () => {
  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              <DTDCsurface heading="DTDC Surface"/>

              {/* Right Section */}
              <div className="col-span-2 space-y-4">

                {/* General Information */}
                <GeneralInformation />

                {/* Pincodes Section */}
                <PinCodes />

                {/* Prefetch AWB */}
                <PreFetechAWB />

                {/* Sellers Panel */}
                <Seller />

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

export default CourierDTDC;

