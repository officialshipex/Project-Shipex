import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";

// Sample order data
const returnRequestedData = [
  // TODO: Add your sample orders here
];

const ReturnList = () => {
  // State variables for AWB number, selected orders, and selected status
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Function to handle select all checkbox
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    // Update selected orders based on checkbox state
    returnRequestedData.forEach(order => {
      newSelectedOrders[order.id] = isChecked;
    });
    setSelectedOrders(newSelectedOrders);
  };

  // Filter orders based on the selected status
  const filteredOrders = selectedStatus === "All"
    ? returnRequestedData
    : returnRequestedData.filter(order => order.status === selectedStatus);

  // Define headers based on selected status
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* NavBar */}
        <NavBar />

        {/* Main Content */}
        <div className="container mx-auto mt-0 bg-white shadow-md rounded-lg p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4 p-4">
            <h2 className="text-2xl font-bold">Return Orders</h2>
            {/* TODO: Add action buttons here */}
          </div>

          {/* Order Status Row */}
          <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-lg">
            {["Return requested", "New return requested", "Schedule pickup", "In transit", "Received", "Pending refund", "All"].map((status, index) => (
              <button
                key={index}
                className={`text-gray-600 py-1 px-2 mr-1 rounded-lg hover:bg-green-200 transition duration-300 ${selectedStatus === status ? 'bg-green-500 text-white font-bold' : ''}`}
                onClick={() => {
                  setSelectedStatus(status);
                  console.log("Selected Status:", status); // Debugging log
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table Headers for Order Details */}
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
                    onChange={() => handleSelectOrder(order.id)} // TODO: Define handleSelectOrder function
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Order ID: #{order.id}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{order.customerName}</p>
                    <p>{order.email}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{order.product}</p>
                    <p>SKU: {order.sku}</p>
                    <p>Qty: {order.qty}</p>
                    <p>{order.price}</p>
                  </div>
                  <div className="flex-1">
                    <p>{order.paymentStatus}</p>
                  </div>
                  <div className="flex-1">
                    <p>{order.pickupAddress}</p>
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : ''}`}>{order.status}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <button
                      onClick={() => handleShipOrder(order.id)} // TODO: Define handleShipOrder function
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Ship
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnList;
