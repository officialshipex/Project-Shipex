import React, { useState } from "react";
// import NavBar from "../Common/NavBar";
// import Sidebar from "../Common/Sidebar";
import { FaChevronDown, FaSearch } from "react-icons/fa";

// Sample order data
const orders = [
  {
    id: 1,
    customerName: "Alice Green",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    product: "T-shirt",
    sku: "SKU123",
    qty: 2,
    deadWeight: "0.5 kg",
    volumetricWeight: "0.7 kg",
    price: "₹2000",
    paymentStatus: "Paid",
    pickupAddress: "Delhi",
    status: "New Orders",
  },


  {
    id: 11,
    orderDetails: "Order #129",
    customerName: "Alice Brown",
    orderedShippedDate: "2024-10-18",
    shippingDetails: "Returned via Courier G",
    rtoEDD: "2024-10-25",
    rtoAddress: "Delhi",
    status: "Lost/Damage",
  },
  

  {
    id: 11,
    orderDetails: "Order #129",
    customerName: "Alice Brown",
    orderedShippedDate: "2024-10-18",
    shippingDetails: "Returned via Courier G",
    rtoEDD: "2024-10-25", // You can specify the expected delivery date if applicable
    rtoAddress: "Delhi",
    status: "Cancelled",
  },
  {
    id: 2,
    customerName: "David Blue",
    email: "david@example.com",
    contactNo: "987-654-3210",
    product: "Jeans",
    sku: "SKU124",
    qty: 1,
    deadWeight: "1 kg",
    volumetricWeight: "1.2 kg",
    price: "₹3000",
    paymentStatus: "Unpaid",
    pickupAddress: "Delhi",
    status: "New Orders",
  },
  {
    id: 3,
    orderDetails: "Order #123",
    customerName: "John Doe",
    payment: "₹5000",
    pickupAddress: "Mumbai",
    shippingDetails: "Delivered via Courier A",
    status: "Ready To Ship",
  },
  {
    id: 4,
    orderDetails: "Order #124",
    customerName: "Jane Smith",
    payment: "₹3500",
    pickupAddress: "Bangalore",
    shippingDetails: "In Transit via Courier B",
    status: "Ready To Ship",
  },
  {
    id: 5,
    pickId: "PICK001",
    pickRequestDate: "2024-10-25",
    shipmentCount: 5,
    pickupAddress: "Mumbai",
    parentCourier: "Courier A",
    pickupStatus: "Scheduled",
    status: "Pick ups",
  },
  {
    id: 6,
    pickId: "PICK002",
    pickRequestDate: "2024-10-26",
    shipmentCount: 3,
    pickupAddress: "Bangalore",
    parentCourier: "Courier B",
    pickupStatus: "Completed",
    status: "Pick ups",
  },
  {
    id: 10,
    orderDetails: "Order #128",
    customerName: "Eve White",
    orderedShippedDate: "2024-10-20",
    shippingDetails: "In Transit via Courier F",
    rtoEDD: "2024-10-30",
    rtoAddress: "Mumbai",
    status: "RTO",
  },  
  {
    id: 7,
    orderDetails: "Order #125",
    customerName: "Alice Brown",
    payment: "₹4500",
    pickupAddress: "Delhi",
    shippingDetails: "In Transit via Courier C",
    status: "In Transit",
  },
  {
    id: 8,
    orderDetails: "Order #126",
    customerName: "Bob White",
    payment: "₹2000",
    pickupAddress: "Chennai",
    shippingDetails: "In Transit via Courier D",
    status: "In Transit",
  },
  {
    id: 9,
    orderDetails: "Order #127",
    customerName: "Cathy Black",
    payment: "₹3000",
    pickupAddress: "Pune",
    shippingDetails: "Delivered via Courier E",
    status: "Delivered",
  },
  
];

const ORDER_STATUSES = [
  "New Orders",
  "Ready To Ship",
  "Pick ups",
  "In Transit",
  "Delivered",
  "RTO",
  "Cancelled",
  "Lost/Damage",
  "All",
];

const HEADERS = {
  "New Orders": [
    "Order Details",
    "Customer Details",
    "Product Details",
    "Package Details",
    "Payments",
    "Pickup Address",
    "Status",
    "Action",
  ],
  "Ready To Ship": [
    "Order Details",
    "Customer Details",
    "Payment",
    "Pickup Address",
    "Shipping Details",
    "Status",
    "Action",
  ],
  "Pick ups": [
    "Pick id/ Pick request date",
    "Shipment count",
    "Pickup Address",
    "Parent courier",
    "Pickup Status",
    "Action",
  ],
  "In Transit": [
    "Order Details",
    "Customer Details",
    "Payments",
    "Shipping Details",
    "EDD",
    "Status",
    "Action",
  ],
  "Delivered": [
    "Order details",
    "Customer details",
    "Payments",
    "Shipping Details",
    "Status",
    "Action",
  ],
  "RTO": [
    "Order details",
    "Customer details",
    "Ordered shipped date",
    "Shipping Details",
    "RTO EDD",
    "RTO address",
    "Status",
    "Action",
  ],
  "Cancelled": [
    "Order details",
    "Customer details",
    "Payments",
    "Pickup/RTO addresses",
    "Shipping detail",
    "Status",
    "Action",
  ],
  "Lost/Damage": [
    "Order details",
    "Customer details",
    "Payments",
    "Pickup/RTO addresses",
    "Shipping detail",
    "Status",
    "Action",
  ],
};

const OrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const handleShipOrder = (orderId) => {
    console.log(`Order ${orderId} has been shipped.`);
    // Implement your shipping logic here
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* <NavBar /> */}

        {/* Main Content */}
        <div className="container mx-auto mt-0 bg-white shadow-md rounded-lg p-2">
        <div className="flex justify-between items-center mb-4 p-4">
            <h2 className="text-2xl font-bold"> Orders</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600">
                Select all Orders
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600">
                Add an order
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




          {/* Order Status Row */}
          <div className="flex items-center mb-4">
  {[  "New Orders",
  "Ready To Ship",
  "Pick ups",
  "In Transit",
  "Delivered",
  "RTO",
  "Cancelled",
  "Lost/Damage",
  "All"].map((status, index) => (
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

          {/* Orders Table */}
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {HEADERS[selectedStatus] &&
                  HEADERS[selectedStatus].map((header, index) => (
                    <th
                      key={index}
                      className="border-b px-4 py-2 text-left text-gray-700 font-semibold"
                    >
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  {selectedStatus === "New Orders" && (
                    <>
                      <td className="border-b px-4 py-2">Order #{order.id}</td>
                      <td className="border-b px-4 py-2">
                        {order.customerName}
                        <br />
                        {order.email}
                        <br />
                        {order.contactNo}
                      </td>
                      <td className="border-b px-4 py-2">
                        {order.product}
                        <br />
                        {order.sku}
                        <br />
                        {order.qty}
                      </td>
                      <td className="border-b px-4 py-2">
                        {order.deadWeight}
                        <br />
                        {order.volumetricWeight}
                      </td>
                      <td className="border-b px-4 py-2">{order.price}</td>
                      <td className="border-b px-4 py-2">{order.pickupAddress}</td>
                      <td className="border-b px-4 py-2">{order.status}</td>
                      <td className="border-b px-4 py-2 flex flex-col items-center">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Ship Now
                        </button>
                        {/* SVG Icon only in New Orders */}
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="21" cy="21" r="21" fill="#0CBB7D"/>
  <g>
    <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white"/>
    <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white"/>
    <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white"/>
  </g>
</svg>

                      </td>
                    </>
                  )}
                  {selectedStatus === "Ready To Ship" && (
                    <>
                      <td className="border-b px-4 py-2">{order.orderDetails}</td>
                      <td className="border-b px-4 py-2">{order.customerName}</td>
                      <td className="border-b px-4 py-2">{order.payment}</td>
                      <td className="border-b px-4 py-2">{order.pickupAddress}</td>
                      <td className="border-b px-4 py-2">{order.shippingDetails}</td>
                      <td className="border-b px-4 py-2">{order.status}</td>
                      <td className="border-b px-4 py-2">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Download
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Pick ups" && (
                    <>
                      <td className="border-b px-4 py-2">
                        {order.pickId} / {order.pickRequestDate}
                      </td>
                      <td className="border-b px-4 py-2">{order.shipmentCount}</td>
                      <td className="border-b px-4 py-2">{order.pickupAddress}</td>
                      <td className="border-b px-4 py-2">{order.parentCourier}</td>
                      <td className="border-b px-4 py-2">{order.pickupStatus}</td>
                      <td className="border-b px-4 py-2">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Download invoice
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "In Transit" && (
                    <>
                      <td className="border-b px-4 py-2">{order.orderDetails}</td>
                      <td className="border-b px-4 py-2">{order.customerName}</td>
                      <td className="border-b px-4 py-2">{order.payment}</td>
                      <td className="border-b px-4 py-2">{order.shippingDetails}</td>
                      <td className="border-b px-4 py-2">N/A</td>
                      <td className="border-b px-4 py-2">{order.status}</td>
                      <td className="border-b px-4 py-2">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Track Order
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Delivered" && (
                    <>
                      <td className="border-b px-4 py-2">{order.orderDetails}</td>
                      <td className="border-b px-4 py-2">{order.customerName}</td>
                      <td className="border-b px-4 py-2">{order.payment}</td>
                      <td className="border-b px-4 py-2">{order.shippingDetails}</td>
                      <td className="border-b px-4 py-2">{order.status}</td>
                      <td className="border-b px-4 py-2">
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Create Return
                        </button>
                      </td>
                    </>
                  )}
             {selectedStatus === "RTO" && (
  <>
    <td className="border-b px-4 py-2">{order.orderDetails}</td>
    <td className="border-b px-4 py-2">{order.customerName}</td>
    <td className="border-b px-4 py-2">{order.orderedShippedDate}</td>
    <td className="border-b px-4 py-2">{order.shippingDetails}</td>
    <td className="border-b px-4 py-2">{order.rtoEDD}</td>
    <td className="border-b px-4 py-2">{order.rtoAddress}</td>
    <td className="border-b px-4 py-2">{order.status}</td>
    <td className="border-b px-4 py-2">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        onClick={() => handleShipOrder(order.id)}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="21" cy="21" r="21" fill="#0CBB7D"/>
  <g>
    <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white"/>
    <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white"/>
    <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white"/>
  </g>
</svg>

      </button>
    </td>
  </>
)}

                 
{selectedStatus === "Cancelled" && (
  <>
 {selectedStatus === "Cancelled" && (
  <td className="border-b px-4 py-2">
    {`${order.orderedShippedDate} - ${order.orderDetails}`}
  </td>
)}

    <td className="border-b px-4 py-2">{order.customerName}</td>
  
    <td className="border-b px-4 py-2">{order.shippingDetails}</td>
    <td className="border-b px-4 py-2">{order.rtoEDD}</td>
    <td className="border-b px-4 py-2">{order.rtoAddress}</td>
    <td className="border-b px-4 py-2">{order.status}</td>
    <td className="border-b px-4 py-2">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        onClick={() => handleViewDetails(order.id)}
      >
        Clone Order
      </button>
    </td>
  </>
)}
        {selectedStatus === "Lost/Damage" && (
  <>
    <td className="border-b px-4 py-2">
      {`${order.orderedShippedDate} - ${order.orderDetails}`}
    </td>
    <td className="border-b px-4 py-2">{order.customerName}</td>
    <td className="border-b px-4 py-2">{order.payment}</td>
    <td className="border-b px-4 py-2">{order.rtoEDD}</td>
    <td className="border-b px-4 py-2">{order.rtoAddress}</td>
    <td className="border-b px-4 py-2">{order.status}</td>
    <td className="border-b px-4 py-2">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        onClick={() => handleViewDetails(order.id)}
      >
        Clone Order
      </button>
    </td>
  </>
)}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;