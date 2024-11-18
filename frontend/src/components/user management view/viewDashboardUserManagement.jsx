import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";

const AddStaffAccount = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Add Staff Account</h2>
        <button className="bg-green-500 text-white py-2 px-4 rounded">View Staff</button>
      </div>

      {/* Basics Section */}
      <div className="bg-green-50 rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Basics</h3>
          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Active</label>
            <input type="checkbox" className="toggle-checkbox" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input type="text" placeholder="Enter your name" className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input type="text" placeholder="Enter your name" className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email ID</label>
            <input type="email" placeholder="Enter your email" className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
            <input type="text" placeholder="Enter your number" className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input type="password" placeholder="Enter password" className="input-field" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input type="password" placeholder="Enter confirmed password" className="input-field" />
          </div>
        </div>
      </div>

      {/* Access Rights Section */}
      <div className="bg-green-50 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Access Rights</h3>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center mb-2">
            <input type="checkbox" className="toggle-checkbox mr-2" />
            <span className="text-gray-800 font-medium">Billing</span>
          </div>
          
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left border-b">View</th>
                  <th className="py-2 px-4 text-left border-b">Export</th>
                  <th className="py-2 px-4 text-left border-b">Export2</th>
                  <th className="py-2 px-4 text-left border-b">Download</th>
                  <th className="py-2 px-4 text-left border-b">Download AWB</th>
                  <th className="py-2 px-4 text-left border-b">Print</th>
                  <th className="py-2 px-4 text-left border-b">View Details</th>
                  <th className="py-2 px-4 text-left border-b">Upload</th>
                  <th className="py-2 px-4 text-left border-b">Email</th>
                  <th className="py-2 px-4 text-left border-b">Import</th>
                </tr>
              </thead>
              <tbody>
                {['Remittance', 'Shipping Charges', 'Bill Summary', 'Credit Receipt', 'Lost'].map((item) => (
                  <tr key={item}>
                    <td className="py-2 px-4 border-b text-center">{item}</td>
                    {Array.from({ length: 9 }).map((_, index) => (
                      <td key={index} className="py-2 px-4 border-b text-center">
                        <input type="checkbox" className="checkbox" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


const AddStaff = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <AddStaffAccount />
      </div>
    </div>
  );
};

export default AddStaff;
