import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";
import { FaChevronDown, FaSearch } from "react-icons/fa";

// Sample order data for return requested
const returnRequestedData = [
  {
    id: "RR123",
    date: "2024-11-01",
    buyerName: "John Doe",
    email: "john@example.com",
    product: "T-Shirt",
    shippingAddress: "123 Main St, City",
    refundDetails: "Pending",
    status: "Return requested",
  },
];

// Sample order data for "New return requested"
const newReturnRequestedData = [
  {
    id: "NRR124",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Jane Smith",
    email: "jane@example.com",
    product: "Shoes",
    dimensions: "30x20x10",
    warehouseAddress: "456 Warehouse St, City",
    refundDetails: "Pending",
    status: "New return requested",
  },
];

// Sample order data for "Schedule pickup"
const schedulePickupData = [
  {
    id: "SP125",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Alice Brown",
    email: "alice@example.com",
    product: "Laptop",
    shippingAddress: "789 Business Rd, City",
    refundDetails: "Approved",
    status: "Schedule pickup",
  },
];

// Sample order data for "In transit"
const inTransitData = [
  {
    id: "IT126",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Bob Johnson",
    email: "bob@example.com",
    product: "Headphones",
    shippingAddress: "159 Commerce St, City",
    refundDetails: "In transit",
    status: "In transit",
  },
];

// Sample order data for "Received"
const receivedData = [
  {
    id: "R127",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Charlie White",
    email: "charlie@example.com",
    product: "Monitor",
    shippingAddress: "753 Industry Rd, City",
    refundDetails: "Received",
    status: "Received",
  },
];

// Sample order data for "Pending refund"
const pendingRefundData = [
  {
    id: "PR128",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Diana Green",
    email: "diana@example.com",
    product: "Keyboard",
    shippingAddress: "852 Technology Blvd, City",
    refundDetails: "Refund pending",
    status: "Pending refund",
  },
];

const ReturnList = () => {
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    [
      ...returnRequestedData,
      ...newReturnRequestedData,
      ...schedulePickupData,
      ...inTransitData,
      ...receivedData,
      ...pendingRefundData,
    ].forEach(order => {
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
    ? [
        ...returnRequestedData,
        ...newReturnRequestedData,
        ...schedulePickupData,
        ...inTransitData,
        ...receivedData,
        ...pendingRefundData,
      ]
    : [
        ...returnRequestedData,
        ...newReturnRequestedData,
        ...schedulePickupData,
        ...inTransitData,
        ...receivedData,
        ...pendingRefundData,
      ].filter(order => order.status === selectedStatus);

  const getHeaders = (status) => {
    switch (status) {
      case "Return requested":
        return ["Request Id & Date", "Buyer Details", "Product Details", "Return Reason", "Refund Details", "Status", "Action"];
      case "New return requested":
        return ["Request Id & Date", "Buyer Details", "Product Details", "Dimensions", "Warehouse Address", "Refund Details", "Action"];
      case "Schedule pickup":
        return ["Request Id & Date", "Buyer Details", "Product Details", "Shipping Address", "Refund Details", "Status", "Action"];
      case "In transit":
        return ["Return Details", "Product Details", "Shipping Details", "Warehouse Address", "Refund Details", "Status", "Action"];
      case "Received":
        return ["Return Details", "Product Details", "Shipping Details", "Warehouse Address", "Refund Details", "Status", "Action"];
      case "Pending refund":
        return ["Return Details", "Buyer Details", "Product Details", "Shipping Detail", "Refund Details", "Status", "Action"];
      default:
        return ["Return Details", "Buyer Details", "Product Details", "Shipping Detail", "Refund Details", "Status", "Action"];
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="container mx-auto mt-0 bg-white shadow-md rounded-lg p-2">

          <div className="flex justify-between items-center mb-4 p-4">
            <h2 className="text-2xl font-bold">Return Orders</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-[#0CBB7D] text-white rounded-md text-sm font-medium hover:bg-[#0AA56F]">
                Select all Orders
              </button>
            
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-200">
                  Pick the dates
                  <FaChevronDown className="ml-2" />
                </button>
              </div>
              <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-gray-100">
                <FaSearch className="text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search AWB number" 
                  className="bg-transparent focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center mb-4">
            {["Return requested", "New return requested", "Schedule pickup", "In transit", "Received", "Pending refund", "All"].map((status, index) => (
              <button
                key={index}
                className={`py-2 px-4 text-sm transition duration-300 ${selectedStatus === status
                    ? 'border-b-2 border-[#0CBB7D] font-semibold text-black'
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
              <input type="checkbox" onChange={handleSelectAll} />
              {getHeaders(selectedStatus).map((header, index) => (
                <div key={index} className="flex-1">{header}</div>
              ))}
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div key={order.id} className="border-b p-4 flex items-center text-left space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders[order.id] || false}
                    onChange={() => handleSelectOrder(order.id)}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">
                      {/* Format Request Id & Date */}
                      <span>{order.id}</span> <br />
                      <span>{new Date(order.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })} |</span>
                      <span> {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', '.') } </span> <br />
                      <span className="text-gray-600">CUSTOM</span> <br />
                      <a href="#" className="text-[#0CBB7D] ml-0 mt-1">View product</a>
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{order.buyerName}</p>
                    <p>{order.email}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{order.product}</p>
                    <p className="px-3 py-1 bg-[#F4F4F4] text-[#1B8D46] rounded-full text-sm shadow-md inline-block mt-1">
                      Prepaid
                    </p>
                  </div>

                  {order.shippingAddress ? (
                    <div className="flex-1">
                      <p>{order.shippingAddress}</p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p>{order.buyerDetails}</p>
                    </div>
                  )}

                  <div className="flex-1">
                    <p>{order.refundDetails}</p>
                  </div>

                  <div className="flex-1">
                    <span className="px-3 py-1 border-none bg-[#DFF5E0] rounded-full text-sm text-[#1B8D46] shadow-md">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex-1">
                    <button onClick={() => handleShipOrder(order.id)} className="px-2 py-1 bg-[#0CBB7D] text-white rounded-md hover:bg-[#0AA56F]">
                      Schedule Pick up
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnList;
