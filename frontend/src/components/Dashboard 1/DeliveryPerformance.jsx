import React, { useState } from "react";

const TabSelector = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === tab
              ? "bg-green-100 text-green-600 font-semibold"
              : "text-gray-500 hover:text-green-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const DeliveryPerformance = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const performanceData = [
    { label: "On Time", value: "4%", description: "(in percent)" },
    { label: "Late Deliverers", value: "0%", description: "(in percent)" },
  ];

  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Delivery Performance</h2>
      
      {/* Tabs */}
      <TabSelector
        tabs={["Today", "Yesterday", "Last Week", "Past Month", "Custom"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Performance Data */}
      <div className="flex gap-8 mt-4 justify-center">
        {performanceData.map((item, index) => (
          <div
            key={index}
            className="text-center min-w-[100px] border border-gray-300 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-gray-700">{item.value}</div>
            <p className="text-gray-600 mt-1 text-sm">{item.label}</p>
            <p className="text-gray-400 text-xs">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPerformance;
