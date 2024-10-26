import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";

// Sample order data for return requested
const returnRequestedData = [
  {
    id: 1,
    date: "2024-10-01",
    buyerName: "John Doe",
    email: "john@example.com",
    product: "T-Shirt",
    shippingAddress: "123 Main St, City A", // Updated label
    refundDetails: "Pending",
    status: "Return requested",
  },
  {
    id: 2,
    date: "2024-10-02",
    buyerName: "Jane Smith",
    email: "jane@example.com",
    product: "Jeans",
    shippingAddress: "456 Elm St, City B", // Updated label
    refundDetails: "Processed",
    status: "Return requested",
  },
];

// Sample order data for "New return requested"
const newReturnRequestedData = [
  {
    id: 3,
    date: "2024-10-03",
    buyerName: "Alice Brown",
    email: "alice@example.com",
    product: "Shoes",
    dimensions: "10x5x5",
    buyerDetails: "Warehouse 1, Location A", // Updated label
    refundDetails: "Pending",
    status: "New return requested",
  },
];

// Sample order data for "Schedule pickup"
const schedulePickupData = [
  {
    id: 4,
    date: "2024-10-04",
    buyerName: "Bob White",
    email: "bob@example.com",
    product: "Hat",
    shippingDetail: "Delivery to Location B",
    refundDetails: "Pending",
    status: "Schedule pickup",
  },
];

// Sample order data for "In transit"
const inTransitData = [
  {
    id: 5,
    date: "2024-10-05",
    buyerName: "Charlie Green",
    email: "charlie@example.com",
    product: "Sweater",
    shippingDetail: "In Transit to Location C",
    buyerDetails: "Warehouse 2, Location B", // Updated label
    refundDetails: "Not Applicable",
    status: "In transit",
  },
];

// Sample order data for "Received"
const receivedData = [
  {
    id: 6,
    date: "2024-10-06",
    buyerName: "David Black",
    email: "david@example.com",
    product: "Jacket",
    shippingDetail: "Received at Warehouse 1",
    buyerDetails: "Warehouse 1, Location C", // Updated label
    refundDetails: "Completed",
    status: "Received",
  },
];

// Sample order data for "Pending refund"
const pendingRefundData = [
  {
    id: 7,
    date: "2024-10-07",
    buyerName: "Emily White",
    email: "emily@example.com",
    product: "Socks",
    shippingDetail: "Delivery to Location D",
    refundDetails: "Pending",
    status: "Pending refund",
  },
  {
    id: 8,
    date: "2024-10-08",
    buyerName: "Frank Black",
    email: "frank@example.com",
    product: "Scarf",
    shippingDetail: "Delivery to Location E",
    refundDetails: "Pending",
    status: "Pending refund",
  },
];

const ReturnList = () => {
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    // Update selected orders based on checkbox state
    [
      ...returnRequestedData,
      ...newReturnRequestedData,
      ...schedulePickupData,
      ...inTransitData,
      ...receivedData, // Include received data
      ...pendingRefundData, // Include pending refund data
    ].forEach(order => {
      newSelectedOrders[order.id] = isChecked;
    });
    setSelectedOrders(newSelectedOrders);
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle selection
    }));
  };

  const handleShipOrder = (id) => {
    // Logic for scheduling a pickup
    console.log(`Scheduling pickup for order ID: ${id}`);
  };

  const filteredOrders = selectedStatus === "All"
    ? [
        ...returnRequestedData,
        ...newReturnRequestedData,
        ...schedulePickupData,
        ...inTransitData,
        ...receivedData, // Include received data
        ...pendingRefundData, // Include pending refund data
      ]
    : [
        ...returnRequestedData,
        ...newReturnRequestedData,
        ...schedulePickupData,
        ...inTransitData,
        ...receivedData, // Include received data
        ...pendingRefundData, // Include pending refund data
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
        return ["Return Details", "Product Details", "Shipping Details", "Warehouse Address", "Refund Details", "Status", "Action"]; // Added case for Received
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
          </div>

          <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-lg">
            {["Return requested", "New return requested", "Schedule pickup", "In transit", "Received", "Pending refund", "All"].map((status, index) => (
              <button
                key={index}
                className={`text-gray-600 py-1 px-2 mr-1 rounded-lg hover:bg-green-200 transition duration-300 ${selectedStatus === status ? 'bg-green-500 text-white font-bold' : ''}`}
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

            {/* Filtered Orders List */}
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div key={order.id} className="border-b p-4 flex items-start text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders[order.id] || false}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{`Request Id: ${order.id} & Date: ${order.date}`}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{order.buyerName}</p>
                    <p>{order.email}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{order.product}</p>
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
                    <p className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : ''}`}>{order.status}</p>
                  </div>
                  <div className="flex-1">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleShipOrder(order.id)}
                    >
                      Schedule pick up
                    </button>
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

export default ReturnList;
