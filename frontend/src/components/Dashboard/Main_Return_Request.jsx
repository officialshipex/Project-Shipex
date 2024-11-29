import React, { useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
//import NavBar from "../Common/NavBar";
//import Sidebar from "../Common/Sidebar";

// Sample order data for return requested
const returnRequestedData = [
  {
    id: "RR123",
    date: "2024-11-01T05:30:00Z",
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

// In the schedulePickupData section
const schedulePickupData = [
  {
    id: "SP125",
    date: "2024-11-01T12:00:00Z",
    buyerName: "Alice Brown",
    email: "alice@example.com",
    product: "Laptop",
    shippingAddress: "DTDC Surface",
    awb: "AWB12345", // Added AWB number
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
        return ["Request Id & Date", "Buyer Details", "Product Details", "Dimensions", "Warehouse Address", "Refund Details", "Action"];
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
    
        <div className="flex-1">
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

          <div className="relative border-b mb-4">
            <div className="flex items-center space-x-6">
              {[
                "Return requested",
                "New return requested",
                "Schedule pickup",
                "In transit",
                "Received",
                "Pending refund",
                "All",
              ].map((status, index) => (
                <div key={index} className="relative">
                  <button
                    className={`py-2 text-sm transition duration-300 ${selectedStatus === status ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </button>
                  {selectedStatus === status && (
                    <div className="absolute bottom-[-2px] left-0 right-0 mx-auto h-[2px] w-[100%] bg-[#0CBB7D] rounded-full transition-all duration-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Header Container */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <div className="border-b p-4 flex font-medium text-left bg-[#F4F4F4]">
              <input type="checkbox" onChange={handleSelectAll} />
              {getHeaders(selectedStatus).map((header, index) => (
                <div key={index} className="flex-1 text-[#1A1A1A]">{header}</div>
              ))}
            </div>
          </div>



          {/* Order Details Container with gap */}
          <div className="space-y-4">
          {filteredOrders.length > 0 ? (
  filteredOrders.map(order => (
    <div key={order.id} className="bg-[#F4F4F4] shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={selectedOrders[order.id] || false}
          onChange={() => handleSelectOrder(order.id)}
          className="w-4 h-4 border-2 border-[#0CBB7D] bg-white rounded-md cursor-pointer peer checked:bg-[#0CBB7D] checked:border-[#0CBB7D] focus:outline-none"
        />
        <div className="flex-1">
          <p className="font-semibold text-[#1A1A1A] text-[14px]">
            <span>{order.id}</span> <br />
            <span>{new Date(order.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} | {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', '.')}</span> <br />
            <span className="text-gray-600">CUSTOM</span> <br />
            <a href="#" className="text-[#0CBB7D] ml-0 mt-1 border-b-2 border-[#0CBB7D]">View product</a>
          </p>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-[#1A1A1A]">{order.buyerName}</p>
          <p>{order.email}</p>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-[#1A1A1A]">{order.product}</p>
          <p className="px-3 py-1 bg-[#F4F4F4] text-[#1B8D46] rounded text-sm shadow-md inline-block mt-1">Prepaid</p>
        </div>

       

        <div className="flex-1">
  <p>{order.shippingAddress}</p>
  {order.awb && (
    <p>
      <span>AWB#</span>
      <span className="text-[#0CBB7D]">{order.awb.slice(3)}</span> {/* Color applied to number part only */}
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block ml-1" // Inline and some margin for separation
      >
        <mask
          id="mask0_1452_12433"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="14"
          height="16"
        >
          <rect
            x="0.0168457"
            y="0.0908203"
            width="13.9832"
            height="15.3636"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask0_1452_12433)">
          <path
            d="M5.26045 11.6164C4.94 11.6164 4.66568 11.4911 4.43748 11.2404C4.20928 10.9896 4.09518 10.6882 4.09518 10.3361V2.65433C4.09518 2.30224 4.20928 2.00084 4.43748 1.75011C4.66568 1.49939 4.94 1.37402 5.26045 1.37402H10.5041C10.8246 1.37402 11.0989 1.49939 11.3271 1.75011C11.5553 2.00084 11.6694 2.30224 11.6694 2.65433V10.3361C11.6694 10.6882 11.5553 10.9896 11.3271 11.2404C11.0989 11.4911 10.8246 11.6164 10.5041 11.6164H5.26045ZM5.26045 10.3361H10.5041V2.65433H5.26045V10.3361ZM2.92991 14.1771C2.60947 14.1771 2.33514 14.0517 2.10695 13.801C1.87875 13.5502 1.76465 13.2488 1.76465 12.8968V3.93463H2.92991V12.8968H9.33888V14.1771H2.92991Z"
            fill="#0CBB7D"
          />
        </g>
      </svg>
    </p>
  )}
</div>

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
    </div>
  ))
) : (
  <p className="p-4 text-gray-600">No orders available</p>
)}

          </div>

          
        </div>
      
    
  );
};

export default ReturnList;
