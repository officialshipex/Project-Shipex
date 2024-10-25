import React, { useState } from "react";
import NavBar from "../Common/NavBar"; // Ensure the path to NavBar is correct
import Sidebar from "../Common/Sidebar"; // Ensure the path to Sidebar is correct
import { AiOutlineDown } from "react-icons/ai"; // Import a down arrow icon

// Example orders with one for each possible scenario
const orders = [
  {
    id: '465826329',
    customerName: 'Riya Sharma',
    email: 'RS@gmail.com',
    product: 'Clothes',
    sku: 'Clothes',
    qty: 1,
    deadWeight: '3.2 Kg',
    dimensions: '10.00 x 10.00 x 12.00 (cm)',
    volumetricWeight: '0.288 Kg',
    price: '₹2000.00',
    status: 'New',
    pickupAddress: 'Delhi',
    paymentStatus: 'Paid'
  },
  {
    id: '465826337',
    customerName: 'Tony Stark',
    email: 'TS@gmail.com',
    product: 'Iron Suit',
    sku: 'IS001',
    qty: 1,
    deadWeight: '15.0 Kg',
    dimensions: '60.00 x 40.00 x 20.00 (cm)',
    volumetricWeight: '3.000 Kg',
    price: '₹500000.00',
    status: 'Ready to Ship',
    pickupAddress: 'Stark Tower, New York',
    paymentStatus: 'Paid'
  },
  {
    id: '465826336',
    customerName: 'Peter Parker',
    email: 'PP@gmail.com',
    product: 'Camera',
    sku: 'CM9102',
    qty: 1,
    deadWeight: '1.0 Kg',
    dimensions: '20.00 x 15.00 x 10.00 (cm)',
    volumetricWeight: '0.300 Kg',
    price: '₹15000.00',
    status: 'Pickup Scheduled',
    pickupAddress: 'Daily Bugle, New York',
    paymentStatus: 'Paid'
  },
  {
    id: '465826331',
    customerName: 'Alice Johnson',
    email: 'AJ@gmail.com',
    product: 'Accessories',
    sku: 'Accessories',
    qty: 5,
    deadWeight: '0.5 Kg',
    dimensions: '5.00 x 5.00 x 5.00 (cm)',
    volumetricWeight: '0.125 Kg',
    price: '₹1000.00',
    status: 'In Transit',
    pickupAddress: 'Bangalore',
    paymentStatus: 'Pending'
  },
  {
    id: '465826332',
    customerName: 'Bob Smith',
    email: 'BS@gmail.com',
    product: 'Books',
    sku: 'Books',
    qty: 3,
    deadWeight: '2.0 Kg',
    dimensions: '20.00 x 15.00 x 5.00 (cm)',
    volumetricWeight: '0.300 Kg',
    price: '₹500.00',
    status: 'Delivered',
    pickupAddress: 'Kolkata',
    paymentStatus: 'Paid'
  },
  {
    id: '465826340',
    customerName: 'Sophia Lee',
    email: 'SL@gmail.com',
    product: 'Laptop Stand',
    sku: 'LTST123',
    qty: 1,
    deadWeight: '1.0 Kg',
    dimensions: '25.00 x 20.00 x 15.00 (cm)',
    volumetricWeight: '0.500 Kg',
    price: '₹1500.00',
    status: 'RTO',
    pickupAddress: 'Hyderabad',
    paymentStatus: 'Refunded'
  },
  {
    id: '465826333',
    customerName: 'Mark Brown',
    email: 'MB@gmail.com',
    product: 'Gadgets',
    sku: 'Gadgets',
    qty: 1,
    deadWeight: '1.2 Kg',
    dimensions: '15.00 x 10.00 x 8.00 (cm)',
    volumetricWeight: '0.200 Kg',
    price: '₹1500.00',
    status: 'Cancelled',
    pickupAddress: 'Chennai',
    paymentStatus: 'Refunded'
  },
  {
    id: '465826334',
    customerName: 'Sarah Connor',
    email: 'SC@gmail.com',
    product: 'Laptop',
    sku: 'LT1234',
    qty: 1,
    deadWeight: '2.5 Kg',
    dimensions: '35.00 x 25.00 x 5.00 (cm)',
    volumetricWeight: '0.600 Kg',
    price: '₹60000.00',
    status: 'Lost/Damage',
    pickupAddress: 'Time Machine HQ, Los Angeles',
    paymentStatus: 'Paid'
  },
];

const OrderList = () => {
  const [awbNumber, setAwbNumber] = useState('');
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSearch = () => {
    console.log("Searching for AWB:", awbNumber);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    orders.forEach(order => {
      newSelectedOrders[order.id] = isChecked;
    });
    setSelectedOrders(newSelectedOrders);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleShipOrder = (orderId) => {
    console.log(`Shipping order ID: ${orderId}`);
    // Add your shipping logic here
  };

  // Filter orders based on the selected status
  const filteredOrders = selectedStatus === "All"
    ? orders
    : orders.filter(order => {
        if (selectedStatus === "New Orders") return order.status === 'New';
        if (selectedStatus === "Ready To Ship") return order.status === 'Ready to Ship';
        if (selectedStatus === "Pick ups") return order.status === 'Pickup Scheduled';
        if (selectedStatus === "In Transit") return order.status === 'In Transit';
        if (selectedStatus === "Delivered") return order.status === 'Delivered';
        if (selectedStatus === "RTO") return order.status === 'RTO';
        if (selectedStatus === "Cancelled") return order.status === 'Cancelled';
        if (selectedStatus === "Lost/Damage") return order.status === 'Lost/Damage';
        return false; // This ensures only specified statuses are returned
      });

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
          {/* Header Section with Bold 'Orders' and Buttons */}
          <div className="flex justify-between items-center mb-4 p-4">
            <h2 className="text-2xl font-bold">Orders</h2>

            <div className="flex items-center space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Select Order
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Add an Order
              </button>

              <button
                onClick={handleSearch}
                className="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center"
              >
                Pick the dates
                <AiOutlineDown className="ml-2" />
              </button>

              <div className="relative flex items-center">
                <img
                  src="/search.jpg"
                  alt="Search Icon"
                  className="absolute left-2 w-6 h-6"
                />
                <input
                  type="text"
                  placeholder="Search AWB Number"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  className="border rounded-lg pl-10 pr-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Order Status Row */}
          <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-lg">
            {["New Orders", "Ready To Ship", "Pick ups", "In Transit", "Delivered", "RTO", "Cancelled", "Lost/Damage", "All"].map((status, index) => (
              <button
                key={index}
                className={`text-gray-600 py-1 px-2 mr-1 rounded-lg hover:bg-green-200 transition duration-300 
                  ${selectedStatus === status ? 'bg-green-500 text-white font-bold' : ''}`}
                onClick={() => setSelectedStatus(status)} // Set the selected status
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table Headers for Order Details */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <div className="border-b p-4 flex font-bold text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={Object.keys(selectedOrders).length === filteredOrders.length && Object.values(selectedOrders).every(Boolean)}
              />
              <div className="flex-1">Order Details</div>
              <div className="flex-1">Customer Details</div>
              <div className="flex-1">Product Details</div>
              <div className="flex-1">Package Details</div>
              <div className="flex-1">Payments</div>
              <div className="flex-1">Pickup Address</div>
              <div className="flex-1">Status</div>
              <div className="flex-1 text-center">Action</div>
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
                    <p className="font-semibold">Dead Weight: {order.deadWeight}</p>
                    <p>Dimensions: {order.dimensions}</p>
                    <p>Volumetric Weight: {order.volumetricWeight}</p>
                  </div>
                  <div className="flex-1">
                    <p>{order.paymentStatus}</p>
                  </div>
                  <div className="flex-1">
                    <p>{order.pickupAddress}</p>
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : 'text-green-500'}`}>{order.status}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <button
                      onClick={() => handleShipOrder(order.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Ship
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">No orders to display.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
