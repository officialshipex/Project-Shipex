import React, { useState } from 'react';
import SideBar from './components/Common/SideBar';

const RateCard_Reverse = () => {
  const [activeTab, setActiveTab] = useState('Forward');
  const [searchTerm, setSearchTerm] = useState('');

  const forwardData = [
    {
      courier: 'Basic Blue Dart Air',
      weight: '500 g',
      localForward: '₹ 49.41',
      regionalForward: '₹ 57.79',
      metroForward: '₹ 63.39',
      roiForward: '₹ 72.71',
      specialForward: '₹ 102.54',
      codCharges: '₹ 36 | 2.3%',
    },
    {
      courier: 'Advance Blue Dart Air',
      weight: '500 g',
      localForward: '₹ 49.41',
      regionalForward: '₹ 57.79',
      metroForward: '₹ 63.39',
      roiForward: '₹ 72.71',
      specialForward: '₹ 102.54',
      codCharges: '₹ 36 | 2.3%',
    },
    {
        courier: 'Basic Blue Dart Air',
        weight: '500 g',
        localForward: '₹ 49.41',
        regionalForward: '₹ 57.79',
        metroForward: '₹ 63.39',
        roiForward: '₹ 72.71',
        specialForward: '₹ 102.54',
        codCharges: '₹ 36 | 2.3%',
      },
      {
        courier: 'Advance Blue Dart Air',
        weight: '500 g',
        localForward: '₹ 49.41',
        regionalForward: '₹ 57.79',
        metroForward: '₹ 63.39',
        roiForward: '₹ 72.71',
        specialForward: '₹ 102.54',
        codCharges: '₹ 36 | 2.3%',
      },
      {
        courier: 'Basic Blue Dart Air',
        weight: '500 g',
        localForward: '₹ 49.41',
        regionalForward: '₹ 57.79',
        metroForward: '₹ 63.39',
        roiForward: '₹ 72.71',
        specialForward: '₹ 102.54',
        codCharges: '₹ 36 | 2.3%',
      },
      {
        courier: 'Advance Blue Dart Air',
        weight: '500 g',
        localForward: '₹ 49.41',
        regionalForward: '₹ 57.79',
        metroForward: '₹ 63.39',
        roiForward: '₹ 72.71',
        specialForward: '₹ 102.54',
        codCharges: '₹ 36 | 2.3%',
      },
  ];

  const reverseData = [
    {
      courier: 'Delivery Reverse | upto 500gms',
      weight: '500 g',
      localReverse: '₹ 40.41',
      regionalReverse: '₹ 48.79',
      metroReverse: '₹ 53.39',
      roiReverse: '₹ 60.71',
      specialReverse: '₹ 90.54',
      codCharges: '₹ 30 | 2.0%',
    },
    {
      courier: 'Delivery Reverse | Additional 500gms',
      weight: '500 g',
      localReverse: '₹ 40.41',
      regionalReverse: '₹ 48.79',
      metroReverse: '₹ 53.39',
      roiReverse: '₹ 60.71',
      specialReverse: '₹ 90.54',
      codCharges: '₹ 30 | 2.0%',
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = activeTab === 'Forward'
    ? forwardData.filter(row =>
        row.courier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.weight.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reverseData.filter(row =>
        row.courier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.weight.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="flex">
      {/* SideBar Component */}
      <div className="w-1/5">
        <SideBar />
      </div>

      {/* Main RateCard Content */}
      <div className="w-4/5 bg-white p-5 rounded-lg shadow-lg max-w-4xl mx-auto ml-0">
        {/* Header with Rate Card title and Search Bar */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Tools</h2>
          
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Enter AWB Number"
            className="px-4 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Tabs for Forward and Reverse */}
        <div className="flex gap-3 mb-5">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'Forward' ? 'bg-green-500 text-white' : 'bg-gray-200'} transition duration-300`}
            onClick={() => setActiveTab('Forward')}
          >
            Forward
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'Reverse' ? 'bg-green-500 text-white' : 'bg-gray-200'} transition duration-300`}
            onClick={() => setActiveTab('Reverse')}
          >
            Reverse
          </button>
        </div>

        {/* Content for Forward and Reverse Tabs */}
        {activeTab === 'Forward' && (
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Courier</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Local Forward</th>
                <th className="p-3 text-left">Regional Forward</th>
                <th className="p-3 text-left">Metro Forward</th>
                <th className="p-3 text-left">ROI Forward</th>
                <th className="p-3 text-left">Special Forward</th>
                <th className="p-3 text-left">COD Charges</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{row.courier}</td>
                  <td className="p-3">{row.weight}</td>
                  <td className="p-3">{row.localForward}</td>
                  <td className="p-3">{row.regionalForward}</td>
                  <td className="p-3">{row.metroForward}</td>
                  <td className="p-3">{row.roiForward}</td>
                  <td className="p-3">{row.specialForward}</td>
                  <td className="p-3">{row.codCharges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'Reverse' && (
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Courier</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Local Reverse</th>
                <th className="p-3 text-left">Regional Reverse</th>
                <th className="p-3 text-left">Metro Reverse</th>
                <th className="p-3 text-left">ROI Reverse</th>
                <th className="p-3 text-left">Special Reverse</th>
                <th className="p-3 text-left">COD Charges</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{row.courier}</td>
                  <td className="p-3">{row.weight}</td>
                  <td className="p-3">{row.localReverse}</td>
                  <td className="p-3">{row.regionalReverse}</td>
                  <td className="p-3">{row.metroReverse}</td>
                  <td className="p-3">{row.roiReverse}</td>
                  <td className="p-3">{row.specialReverse}</td>
                  <td className="p-3">{row.codCharges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Terms & Conditions Section */}
        <div className="mt-8 p-5 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Terms & Conditions</h3>
          <p className="text-sm mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateCard_Reverse;
