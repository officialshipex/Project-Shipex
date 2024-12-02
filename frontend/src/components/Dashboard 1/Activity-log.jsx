import React, { useState } from 'react';
import SideBar from '../Common/SideBar';

const ToolsActivity = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex">
      {/* SideBar Component */}
      <div className="w-1/5">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-white p-5 rounded-lg shadow-lg max-w-4xl mx-auto ml-0">
        {/* Header with Tools title and Search Bar */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Tools</h2>
          
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <img src="/search.jpg" alt="Search Icon" className="w-6 h-6 ml-2" />
            <input
              type="text"
              placeholder="Search AWB number"
              className="px-4 py-2 border-none rounded-lg w-64 focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Title with Thick Green Underline */}
        <h3 className="text-lg mb-4 font-semibold inline-block pb-2 border-b-4 border-green-500">
          Activity Log
        </h3>

        {/* Table Content */}
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-normal">Activity Date</th>
              <th className="p-3 text-left font-normal">Activity Type</th>
              <th className="p-3 text-left font-normal">File</th>
              <th className="p-3 text-left font-normal">Response</th>
              <th className="p-3 text-left font-normal">Error</th>
              <th className="p-3 text-left font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Add table rows here if needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolsActivity;
