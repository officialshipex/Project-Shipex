import React, { useState } from "react";
// import NavBar from "../Common/NavBar";
// import Sidebar from "../Common/Sidebar";

// Sample order data for return requested with various statuses
const returnRequestedData = [
  {
    id: 1,
    date: "02 July 2024 | 123",
    attempt: "3rd Attempt",
    lastNDRReason: "Customer Refused",
    buyerName: "Riya Sharma",
    email: "RS@gmail.com",
    productID: "485862329",
    purchaseDate: "15 Jul 2024 | 07:16 PM",
    phone: "5639742436",
    fulfillment: "CUSTOM",
    ivrStatus: "Pending",
    lastAction: "Pending",
    firstNDR: "Pending",
    aging: "--------",
    status: "Action Required",
  },
  {
    id: 2,
    date: "2024-10-02",
    buyerName: "Jane Smith",
    email: "jane@example.com",
    product: "Jeans",
    shippingAddress: "456 Elm St, City B",
    refundDetails: "Processed",
    status: "Action Taken",
  },
  {
    id: 3,
    date: "2024-10-03",
    buyerName: "Alice Brown",
    email: "alice@example.com",
    product: "Shoes",
    shippingAddress: "789 Oak St, City C",
    refundDetails: "Pending",
    status: "Delivered",
  },
  {
    id: 4,
    date: "2024-10-04",
    buyerName: "Michael Green",
    email: "michael@example.com",
    product: "Watch",
    shippingAddress: "101 Pine St, City D",
    refundDetails: "Pending",
    status: "RTO",
  },
];

const Ndr = () => {
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    returnRequestedData.forEach(order => {
      newSelectedOrders[order.id] = isChecked;
    });
    setSelectedOrders(newSelectedOrders);
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShipOrder = (id) => {
    console.log(`Scheduling pickup for order ID: ${id}`);
  };

  const filteredOrders = selectedStatus === "All"
    ? returnRequestedData
    : returnRequestedData.filter(order => order.status === selectedStatus);

  const getHeaders = (status) => {
    switch (status) {
      case "Action Required":
        return ["Tracking Details", "Customer Details", "Item Details", "Fulfilled by", "IVR Status", "Last Action", "First NDR", "OFD Aging", "Actions"];
      case "Action Taken":
      case "Delivered":
      case "RTO":
        return ["Tracking Details", "Customer Details", "Item Details", "Fulfilled by", "Last Action", "First NDR", "OFD Aging", "Actions"];
      default:
        return ["Tracking Details", "Customer Details", "Item Details", "Fulfilled by", "IVR Status", "Last Action", "First NDR", "OFD Aging", "Actions"];
    }
  };

  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <NavBar /> */}
        <div className="container mx-auto mt-0 bg-white shadow-md rounded-lg p-2">
          <div className="flex justify-between items-center mb-4 p-4">
            <h2 className="text-2xl font-bold">NDR Orders</h2>

            {/* Button Group for 'Select all Orders', 'Add an Order', Date Picker, and Search Bar */}
            <div className="flex items-center space-x-3">
             
              <div className="">
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-200">
                  Pick the dates
                  <span className="ml-2">▼</span>
                </button>
              </div>
              <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-gray-100">
                <span className="text-gray-500 mr-2">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search AWB number" 
                  className="bg-transparent focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>

        
          <div className="flex items-center mb-4">
  {["Action Required", "Action Taken", "Delivered", "RTO", "All"].map((status, index) => (
    <button
      key={index}
      className={`py-2 px-4 text-sm transition duration-300 ${
        selectedStatus === status
          ? 'border-b-2 border-green-500 font-semibold text-black'
          : 'text-gray-500'
      }`}
      onClick={() => setSelectedStatus(status)}
    >
      {status}
    </button>
  ))}
</div>



          <div className="bg-white shadow-md rounded-lg mb-4">
            <div className="border-b p-4 flex font-bold text-left">
              <input type="checkbox" onChange={handleSelectAll} className="mr-2" />
              {getHeaders(selectedStatus).map((header, index) => (
                <div key={index} className="flex-1 text-center">{header}</div>
              ))}
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div key={order.id} className="border-b p-4 flex items-start text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders[order.id] || false}
                    onChange={() => handleSelectOrder(order.id)}
                    className="mr-2"
                  />
                  <div className="flex-1 text-center">
                    <p className="font-semibold">{order.date}</p>
                    <p>{order.attempt}</p>
                    <p className="text-gray-500 text-sm">Last NDR Reason: {order.lastNDRReason}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="font-semibold">{order.buyerName}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="font-semibold">{order.productID}</p>
                    <p>{order.purchaseDate}</p>
                    <p className="text-green-500 cursor-pointer">View product</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p>{order.fulfillment}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">{order.ivrStatus}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">{order.lastAction}</span>
                    <p>Remarks: None</p>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">{order.firstNDR}</span>
                    <p>Remarks: None</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p>{order.aging}</p>
                  </div>
                  <div className="flex-1 text-center text-green-500 cursor-pointer">
                    View History
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">No orders available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ndr;
