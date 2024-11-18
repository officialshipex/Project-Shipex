import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";

// TabSelector component
const TabSelector = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === tab
              ? "text-green-600 font-semibold"
              : "text-gray-500 hover:text-green-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// DeliveryPerformance component
const DeliveryPerformance = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const performanceData = [
    { label: "On Time", value: "4%", description: "(in percent)" },
    { label: "Late Deliveries", value: "0%", description: "(in percent)" },
  ];

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-lg font-semibold mb-4">Delivery Performance</h2>
      <TabSelector
        tabs={["Today", "Yesterday", "Last Week", "Past Month", "Custom"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex gap-8 mt-4 justify-center">
        {performanceData.map((item, index) => (
          <div
            key={index}
            className="text-center min-w-[120px] border border-gray-300 rounded-lg p-4"
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

// NDRStatus component with independent state
const NDRStatus = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const statuses = [
    { label: "Action Required", value: 0 },
    { label: "Action Taken", value: 0 },
    { label: "Delivered", value: 0 },
    { label: "RTO", value: 0 },
    { label: "All", value: 0 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full">
      <h2 className="text-lg font-semibold mb-4">NDR Status</h2>
      <TabSelector
        tabs={["Today", "Yesterday", "Last Week", "Past Month", "Custom"]}
        activeTab={selectedPeriod}
        setActiveTab={setSelectedPeriod}
      />
      <div className="flex gap-8 mt-2 justify-start">
        {statuses.map((status, index) => (
          <div key={index} className="text-center min-w-[100px]">
            <div className="w-16 h-16 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-2xl font-bold text-gray-700 shadow-sm">
              {status.value}
            </div>
            <p className="text-gray-600 mt-1 text-sm leading-tight">{status.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// RTOStatusCard component with independent state
const RTOStatusCard = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const statusData = [
    { label: "RTO Initiated", value: 0 },
    { label: "RTO In Transit", value: 0 },
    { label: "RTO Delivered", value: 0 },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full mx-auto flex-1 h-full">
      <h2 className="text-lg font-semibold mb-6">RTO Status</h2>
      <TabSelector
        tabs={["Today", "Yesterday", "Last Week", "Past Month", "Custom"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex gap-16 mt-2 justify-start">
        {statusData.map((status, index) => (
          <div key={index} className="text-center min-w-[100px]">
            <div className="w-16 h-16 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-2xl font-bold text-gray-700 shadow-sm">
              {status.value}
            </div>
            <p className="text-gray-600 mt-1 text-sm leading-tight">
              {status.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// OrdersSection component with independent state
const OrdersSection = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const stats = [
    { number: 5, line1: "New Orders" },
    { number: 6, line1: "Ready to Ship" },
    { number: 4, line1: "Pickups" },
    { number: 9, line1: "In Transit" },
    { number: 8, line1: "Delivered", line2: "Orders Today" },
    { number: 9, line1: "Delivered" },
    { number: 8, line1: "NDR" },
    { number: 2, line1: "RTO" },
    { number: 0, line1: "Lost/Damaged" },
    { number: 0, line1: "Cancelled" },
  ];

  return (
    <section className="orders mb-8">
      <h2 className="text-lg font-semibold mb-6">Orders</h2>
      <TabSelector
        tabs={["Today", "Yesterday", "Last Week", "Past Month", "Custom"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex gap-8 overflow-x-auto mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center min-w-[80px]">
            <div className="stat-box w-20 h-20 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-2xl font-bold text-gray-700">
              {stat.number}
            </div>
            <p className="text-gray-600 mt-2 text-sm leading-tight">
              {stat.line1}
              <br />
              {stat.line2}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};





// WeightDispute component
// WeightDispute component
const WeightDispute = () => {
  const [activeTab, setActiveTab] = useState("Today");

  const tabs = ["Today", "Yesterday", "Last Week", "Past Month", "Custom"];
  const statuses = [
    { label: "New", count: 0 },
    { label: "Accepted by Courier", count: 0 },
    { label: "Accepted by Customer", count: 0 },
    { label: "Rejected by Courier", count: 0 },
    { label: "Pending Resolution", count: 0 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Weight Dispute</h2>
      <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex gap-8 overflow-x-auto mt-6">
        {statuses.map((status, index) => (
          <div key={index} className="text-center min-w-[80px]">
            <div className="w-20 h-20 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-2xl font-bold text-gray-700">
              {status.count}
            </div>
            <p className="text-gray-600 mt-2 text-sm leading-tight">{status.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};






// Main NewOrder component
const NewOrder = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1 p-8 bg-gray-100 overflow-auto">
          <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md border-l border-r border-gray-200">
            <header className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </header>
            <OrdersSection />
            <div className="flex gap-8 mb-8">
            <RTOStatusCard />
            <NDRStatus />
             {/* Positioning WeightDispute on the right */}
            </div>
            <div className="grid grid-cols-2 gap-8">
            <DeliveryPerformance />
            <WeightDispute />
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewOrder;
