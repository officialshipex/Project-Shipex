import React, { useState } from 'react';
import SideBar from '../Common/SideBar';

const ToolsProductCatalogue = () => {
  const [activeTab, setActiveTab] = useState('Forward');
  const [searchTerm, setSearchTerm] = useState('');

  const forwardData = [
    {
      productName: 'Charger',
      productCategory: 'Electronics',
      sku: '5202',
      hsnCode: '85414010',
      weight: 'Entered: 0 kg',
    },
    {
      productName: 'Shoes',
      productCategory: 'Shoes',
      sku: '568333',
      hsnCode: '64041100',
      weight: 'Entered: 0 kg',
    },
  ];

  const reverseData = [
    {
      productName: 'Item 1',
      productCategory: 'Category 1',
      sku: '12345',
      hsnCode: '67890',
      weight: 'Entered: 1 kg',
    },
    {
      productName: 'Item 2',
      productCategory: 'Category 2',
      sku: '23456',
      hsnCode: '78901',
      weight: 'Entered: 2 kg',
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = activeTab === 'Forward'
    ? forwardData.filter(row =>
        row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reverseData.filter(row =>
        row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
         {/* Search Bar */}
         <div className="flex items-center border border-gray-300 rounded-lg">
  {/* Search Icon */}
  <img src="/search.jpg" alt="Search Icon" className="w-6 h-6 ml-2" />

  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search Product"
    className="px-4 py-2 border-none rounded-lg w-64 focus:outline-none"
    value={searchTerm}
    onChange={handleSearch}
  />
</div>


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

        {/* Table Content */}
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Product Category</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">HSN Code</th>
              <th className="p-3 text-left">Dimension & Weight</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b">
                <td className="p-3">{row.productName}</td>
                <td className="p-3">{row.productCategory}</td>
                <td className="p-3">{row.sku}</td>
                <td className="p-3">{row.hsnCode}</td>
                <td className="p-3">{row.weight}</td>
                <td className="p-3">
                <button className="px-3 py-1 rounded flex items-center border border-gray-300">
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2"
  >
    <g>
      <path
        d="M1.66797 20.0013V16.668H18.3346V20.0013H1.66797ZM5.0013 13.3346H6.16797L12.668 6.85547L11.4805 5.66797L5.0013 12.168V13.3346ZM3.33464 15.0013V11.4596L12.668 2.14714C12.8207 1.99436 12.9978 1.8763 13.1992 1.79297C13.4006 1.70964 13.6124 1.66797 13.8346 1.66797C14.0569 1.66797 14.2721 1.70964 14.4805 1.79297C14.6888 1.8763 14.8763 2.0013 15.043 2.16797L16.1888 3.33464C16.3555 3.48741 16.477 3.66797 16.5534 3.8763C16.6298 4.08464 16.668 4.29991 16.668 4.52214C16.668 4.73047 16.6298 4.93533 16.5534 5.13672C16.477 5.33811 16.3555 5.52214 16.1888 5.6888L6.8763 15.0013H3.33464Z"
        fill="currentColor"
      />
    </g>
  </svg>
  Edit Product
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolsProductCatalogue;
