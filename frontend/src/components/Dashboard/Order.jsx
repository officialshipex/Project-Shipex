import React, { useState, useEffect } from "react";
import 'typeface-poppins';

// import NavBar from "../Common/NavBar";
// import Sidebar from "../Common/Sidebar";
import { FaSearch } from "react-icons/fa";
// Sample order data
const orders = [
  {
    id: 1,
    orderDetails: "11129",
    customerName: "Alice Green",
    Date: "12-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    product: "T-shirt",
    sku: "SKU123",
    qty: 2,
    pickId: "PICK002",
    deadWeight: "0.5 kg",
    weight: "10.00 x 10.00 x 12.00 (cm)",
    volumetricWeight: "0.7 kg ",
    payment: "₹2000",
    paymentStatus: "Paid",
    rtoAddress: "Delhi",
    shippingDetails: "DTDC Surface 2kg",
    status: "New Orders",
  },
  {
    id: 2,
    orderDetails: "12345",
    Date: "12-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    pickId: "PICK002",
    customerName: "David Blue",
    email: "david@example.com",
    contactNo: "987-654-3210",
    product: "Jeans",
    sku: "SKU124",
    shippingDetails: "DTDC Surface 2kg",
    qty: 1,
    deadWeight: "1 kg",
    weight: "1.00 x 1.00 x 12.00 (cm)",
    volumetricWeight: "1.2 kg",
    payment: "₹3000",
    paymentStatus: "Unpaid",
    rtoAddress: "Delhi",
    status: "New Orders",
  },
  //cancelled
  {
    id: 11,
    orderDetails: "Order #129",
    Date: "12-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    customerName: "Alice Brown",
    email: "david@example.com",
    contactNo: "987-654-3210",
    payment: "₹3000",
    paymentStatus: "Unpaid",
    shippingDetails: "DTDC Surface",
    pickId: "5639742436",
    rtoAddress: "Delhi",
    status: "Cancelled",
  },
  //lost/damage
  {
    id: 12,
    orderDetails: "129",
    Date: "12-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    customerName: "Alice Brown",
    email: "david@example.com",
    contactNo: "987-654-3210",
    payment: "₹3000",
    paymentStatus: "Unpaid",
    shippingDetails: "DTDC Surface",
    pickId: "5639742436",
    rtoAddress: "Delhi",
    status: "Lost/Damage",
  },
  {
    id: 3,
    orderDetails: "#123",
    Date: "12-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    customerName: "John Doe",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    payment: "₹5000",
    paymentStatus: "COD",
    rtoAddress: "Mumbai",
    shippingDetails: "DTDC Surface 2kg",
    pickId: "# 5639742436",
    status: "Ready To Ship",
  },
  {
    id: 4,
    orderDetails: "#124",
    Date: "13-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    customerName: "Jane Smith",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    payment: "₹3500",
    paymentStatus: "COD",
    rtoAddress: "Bangalore",
    shippingDetails: "DTDC Surface 2kg",
    shipmentBill: "AWB",
    pickId: "# 5639742436",
    status: "Ready To Ship",
  },
  {
    id: 5,
    orderDetails: "98374",
    pickId: "PICK001",
    Date: "12-jan-2024",
    type: "CUSTOM",
    pickRequestDate: "25-02-2024",
    customerName: "David Blue",
    email: "david@example.com",
    contactNo: "123-456-7890",
    time: "7:35",
    shipmentCount: 5,
    rtoAddress: "Mumbai",
    payment: "₹3000",
    paymentStatus: "Unpaid",
    parentCourier: "Courier A",
    pickupStatus: "Scheduled",
    shippingDetails: "DTDC Surface 2kg",
    shipDate: "on 20-4-2024",
    status: "Pick ups",
  },
  {
    id: 6,
    pickId: "PICK002",
    orderDetails: "73664",
    pickRequestDate: "01-01-2024",
    Date: "12-jan-2024",
    type: "CUSTOM",
    time: "7:35",
    customerName: "David Blue",
    email: "david@example.com",
    contactNo: "123-456-7890",
    payment: "₹3000",
    paymentStatus: "paid",
    shipmentCount: 3,
    rtoAddress: "Bangalore",
    parentCourier: "Courier B",
    pickupStatus: "Completed",
    shipDate: "for 19-2-2024",
    shippingDetails: "DTDC Surface 2kg",
    status: "Pick ups",
  },
  //rto
  {
    id: 10,
    orderDetails: "128",
    Date: "13-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    customerName: "Eve White",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    orderedShippedDate: "20-2-2024",
    payment: "₹3000",
    paymentStatus: "Unpaid",
    shippingDetails: "In Transit via Courier F",
    rtoEDD: "30-2-2024",
    pickId: "46384634",
    rtoAddress: "Mumbai",
    ShippedDate: "1-3-2024",
    status: "RTO",
  },
  //in transit
  {
    id: 7,
    orderDetails: "125",
    Date: "13-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    customerName: "Alice Brown",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    payment: "₹4500",
    paymentStatus: "Prepaid",
    shippingDetails: "In Transit via Courier C",
    pickId: "46384634",
    ShippedDate: "26-4-2024",
    rtoAddress: "Delhi",
    status: "In Transit",
  },
  {
    id: 8,
    orderDetails: "126",
    Date: "13-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    customerName: "Bob White",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    payment: "₹2000",
    paymentStatus: "Paid",
    shippingDetails: "In Transit via Courier D",
    pickId: "46384634",
    ShippedDate: "24-3-2024",
    rtoAddress: "Delhi",
    status: "In Transit",
  },
  //delivered
  {
    id: 9,
    orderDetails: "23127",
    Date: "12-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    customerName: "Cathy Black",
    payment: "₹3000",
    paymentStatus: "Paid",
    rtoAddress: "Pune",
    shippingDetails: "Delivered via Courier E",
    pickId: "46384634",
    ShippedDate: "24-3-2024",
    status: "Delivered",
  },
  {
    id: 14,
    customerName: "Alice Green",
    orderDetails: "04949",
    Date: "12-jan-2024",
    time: "7:35",
    type: "CUSTOM",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    product: "T-shirt",
    sku: "SKU123",
    qty: 2,
    deadWeight: "0.5 kg",
    weight: "10.00 x 10.00 x 12.00 (cm)",
    volumetricWeight: "0.7 kg ",
    payment: "₹2000",
    paymentStatus: "Paid",
    rtoAddress: "Delhi",
    pickId: "46384634",
    shippingDetails: "DTDC Surface 2kg",
    status: "New Orders",
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
  "All": [
    "Order details",
    "Customer details",
    "Payments",
    "Pickup/RTO addresses",
    "Shipping detail",
    "Status",
    "Action",
  ]
};
const OrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [copied, setCopied] = useState(false);
  const [showDates, setshowDates] = useState(false);
  useEffect(() => {
    let handler = () => {
      setshowDates(false);
    }
    document.addEventListener("mousedown", handler);
  })
  const handleClickDates = () => {
    setshowDates((prev) => !prev);
  };

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const handleShipOrder = (orderId) => {
    console.log(`Order ${orderId} has been shipped.`);
  };
  const handleCopy = (orderId) => {
    //handlecopycode
  };
  const handleSelectOrder = (id) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* <NavBar /> */}
        {/* Main Content */}
        <div className="container mx-auto mt-14 bg-white shadow-md rounded-lg p-2">
          <div className="flex justify-between items-start p-4">
            <h2 className="text-2xl font-bold"> Orders</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-[#0CBB7D] text-white rounded-md text-sm font-medium">
                Select all Orders
              </button>
              <button className="px-4 py-2 bg-[#0CBB7D] text-white rounded-md text-sm font-medium ">
                Add an order
              </button>
              <div className="relative">
                <button onClick={handleClickDates} className="flex px-4 py-2 font-style:Poppins bg-gray-100 text-[#1C1B1F] rounded-md text-xs border border-gray-300 hover:bg-gray-200">
                  Pick the dates
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_3165_9875" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
                      <rect width="21" height="21" fill="white" />
                    </mask>
                    <g mask="url(#mask0_3165_9875)">
                      <path d="M6.12378 8.74951L14.8738 8.74951L10.4988 13.1245L6.12378 8.74951Z" fill="#1C1B1F" />
                    </g>
                  </svg>
                </button>
              </div>
              <div className="flex items-center text-center py-2 border border-gray-300 rounded-md bg-gray-100">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search AWB number"
                  className="bg-transparent focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
          {/* Order Status Row */}
          <div className="flex items-start font-style:Poppins">
            {["New Orders",
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
                  className={`py-2 px-4 transition duration-300 ${selectedStatus === status
                    ? 'border-b-2 border-[#0CBB7D] font-style:Poppins bg-[#F9F9F9]'
                    : 'text-gray-500'
                    }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
          </div>
          {showDates && (
            <div className="absolute flex flex-col hover:cursor-pointer space-y-4 top-32 w-36 right-52 px-4 py-2 font-style:Poppins bg-[#F9F9F9] 'text-gray-500 transition-opacity-100">
              <ul className="space-y-1">
                <li className="hover:bg-[#D9D9D9] ">Today</li>
                <li className="hover:bg-[#D9D9D9] ">Yesterday</li>
                <li className="hover:bg-[#D9D9D9] ">Post 2days</li>
                <li className="hover:bg-[#D9D9D9] ">Post 15days</li>
                <li className="hover:bg-[#D9D9D9] ">Post 1month</li>
                <li className="hover:bg-[#D9D9D9] ">Custom</li>
              </ul>
            </div>
          )}
          {/* Orders Table */}
          <table className="bg-white text-gray-300 border-separate border-spacing-y-3 min-w-full text-left font-style:Poppins text-sm">
            <thead >
              <tr className=" bg-[#FAFAFA] rounded-md shadow-md border-b">
                {HEADERS[selectedStatus] &&
                  HEADERS[selectedStatus].map((header, index) => (
                    <th
                      key={index}
                      className="text-[#4e4e4e] font-style:Poppins px-2 py-2 "
                    >
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-[#FAFAFA] px-2 py-2 text-[#1A1A1A] rounded-md border-b">
                  {selectedStatus === "New Orders" && (
                    <>
                      <td className="border-b px-2 py-2 font-poppins"><div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2 ">{order.id}</p>
                          <p className="text-[#666666]">{order.Date}</p>
                          <p>{order.type}</p>
                        </div></div></td>
                      <td className="border-b px-2 py-2 font-style:Poppins">
                        {order.customerName}
                        <br />
                        <p>{order.email}</p>
                        {order.contactNo}
                        <br />
                        <div className="hover:cursor-pointer flex justify-start">
                          <svg width="83" height="18" viewBox="0 0 83 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.088 4.66L4.956 13H3.372L0.228 4.66H1.692L4.164 11.596L6.648 4.66H8.088ZM9.92803 5.512C9.68003 5.512 9.47203 5.428 9.30403 5.26C9.13603 5.092 9.05203 4.884 9.05203 4.636C9.05203 4.388 9.13603 4.18 9.30403 4.012C9.47203 3.844 9.68003 3.76 9.92803 3.76C10.168 3.76 10.372 3.844 10.54 4.012C10.708 4.18 10.792 4.388 10.792 4.636C10.792 4.884 10.708 5.092 10.54 5.26C10.372 5.428 10.168 5.512 9.92803 5.512ZM10.6 6.388V13H9.23203V6.388H10.6ZM18.4561 9.532C18.4561 9.78 18.4401 10.004 18.4081 10.204H13.3561C13.3961 10.732 13.5921 11.156 13.9441 11.476C14.2961 11.796 14.7281 11.956 15.2401 11.956C15.9761 11.956 16.4961 11.648 16.8001 11.032H18.2761C18.0761 11.64 17.7121 12.14 17.1841 12.532C16.6641 12.916 16.0161 13.108 15.2401 13.108C14.6081 13.108 14.0401 12.968 13.5361 12.688C13.0401 12.4 12.6481 12 12.3601 11.488C12.0801 10.968 11.9401 10.368 11.9401 9.688C11.9401 9.008 12.0761 8.412 12.3481 7.9C12.6281 7.38 13.0161 6.98 13.5121 6.7C14.0161 6.42 14.5921 6.28 15.2401 6.28C15.8641 6.28 16.4201 6.416 16.9081 6.688C17.3961 6.96 17.7761 7.344 18.0481 7.84C18.3201 8.328 18.4561 8.892 18.4561 9.532ZM17.0281 9.1C17.0201 8.596 16.8401 8.192 16.4881 7.888C16.1361 7.584 15.7001 7.432 15.1801 7.432C14.7081 7.432 14.3041 7.584 13.9681 7.888C13.6321 8.184 13.4321 8.588 13.3681 9.1H17.0281ZM28.6823 6.388L26.6303 13H25.1903L23.8583 8.116L22.5263 13H21.0863L19.0223 6.388H20.4143L21.7943 11.704L23.1983 6.388H24.6263L25.9703 11.68L27.3383 6.388H28.6823ZM37.1539 13L35.2339 9.664H34.1899V13H32.8219V4.66H35.7019C36.3419 4.66 36.8819 4.772 37.3219 4.996C37.7699 5.22 38.1019 5.52 38.3179 5.896C38.5419 6.272 38.6539 6.692 38.6539 7.156C38.6539 7.7 38.4939 8.196 38.1739 8.644C37.8619 9.084 37.3779 9.384 36.7219 9.544L38.7859 13H37.1539ZM34.1899 8.572H35.7019C36.2139 8.572 36.5979 8.444 36.8539 8.188C37.1179 7.932 37.2499 7.588 37.2499 7.156C37.2499 6.724 37.1219 6.388 36.8659 6.148C36.6099 5.9 36.2219 5.776 35.7019 5.776H34.1899V8.572ZM45.7919 4.66V5.776H43.5719V13H42.2039V5.776H39.9719V4.66H45.7919ZM50.9813 13.084C50.2053 13.084 49.4893 12.904 48.8333 12.544C48.1853 12.176 47.6693 11.668 47.2853 11.02C46.9093 10.364 46.7213 9.628 46.7213 8.812C46.7213 7.996 46.9093 7.264 47.2853 6.616C47.6693 5.968 48.1853 5.464 48.8333 5.104C49.4893 4.736 50.2053 4.552 50.9813 4.552C51.7653 4.552 52.4813 4.736 53.1293 5.104C53.7853 5.464 54.3013 5.968 54.6773 6.616C55.0533 7.264 55.2413 7.996 55.2413 8.812C55.2413 9.628 55.0533 10.364 54.6773 11.02C54.3013 11.668 53.7853 12.176 53.1293 12.544C52.4813 12.904 51.7653 13.084 50.9813 13.084ZM50.9813 11.896C51.5333 11.896 52.0253 11.772 52.4573 11.524C52.8893 11.268 53.2253 10.908 53.4653 10.444C53.7133 9.972 53.8373 9.428 53.8373 8.812C53.8373 8.196 53.7133 7.656 53.4653 7.192C53.2253 6.728 52.8893 6.372 52.4573 6.124C52.0253 5.876 51.5333 5.752 50.9813 5.752C50.4293 5.752 49.9373 5.876 49.5053 6.124C49.0733 6.372 48.7333 6.728 48.4853 7.192C48.2453 7.656 48.1253 8.196 48.1253 8.812C48.1253 9.428 48.2453 9.972 48.4853 10.444C48.7333 10.908 49.0733 11.268 49.5053 11.524C49.9373 11.772 50.4293 11.896 50.9813 11.896ZM64.0367 13L62.1167 9.664H61.0727V13H59.7047V4.66H62.5847C63.2247 4.66 63.7647 4.772 64.2047 4.996C64.6527 5.22 64.9847 5.52 65.2007 5.896C65.4247 6.272 65.5367 6.692 65.5367 7.156C65.5367 7.7 65.3767 8.196 65.0567 8.644C64.7447 9.084 64.2607 9.384 63.6047 9.544L65.6687 13H64.0367ZM61.0727 8.572H62.5847C63.0967 8.572 63.4807 8.444 63.7367 8.188C64.0007 7.932 64.1327 7.588 64.1327 7.156C64.1327 6.724 64.0047 6.388 63.7487 6.148C63.4927 5.9 63.1047 5.776 62.5847 5.776H61.0727V8.572ZM67.9827 5.512C67.7347 5.512 67.5267 5.428 67.3587 5.26C67.1907 5.092 67.1067 4.884 67.1067 4.636C67.1067 4.388 67.1907 4.18 67.3587 4.012C67.5267 3.844 67.7347 3.76 67.9827 3.76C68.2227 3.76 68.4267 3.844 68.5947 4.012C68.7627 4.18 68.8467 4.388 68.8467 4.636C68.8467 4.884 68.7627 5.092 68.5947 5.26C68.4267 5.428 68.2227 5.512 67.9827 5.512ZM68.6547 6.388V13H67.2867V6.388H68.6547ZM72.8508 13.108C72.3308 13.108 71.8628 13.016 71.4468 12.832C71.0388 12.64 70.7148 12.384 70.4748 12.064C70.2348 11.736 70.1068 11.372 70.0908 10.972H71.5068C71.5308 11.252 71.6628 11.488 71.9028 11.68C72.1508 11.864 72.4588 11.956 72.8268 11.956C73.2108 11.956 73.5068 11.884 73.7148 11.74C73.9308 11.588 74.0388 11.396 74.0388 11.164C74.0388 10.916 73.9188 10.732 73.6788 10.612C73.4468 10.492 73.0748 10.36 72.5628 10.216C72.0668 10.08 71.6628 9.948 71.3508 9.82C71.0388 9.692 70.7668 9.496 70.5348 9.232C70.3108 8.968 70.1988 8.62 70.1988 8.188C70.1988 7.836 70.3028 7.516 70.5108 7.228C70.7188 6.932 71.0148 6.7 71.3988 6.532C71.7908 6.364 72.2388 6.28 72.7428 6.28C73.4948 6.28 74.0988 6.472 74.5548 6.856C75.0188 7.232 75.2668 7.748 75.2988 8.404H73.9308C73.9068 8.108 73.7868 7.872 73.5708 7.696C73.3548 7.52 73.0628 7.432 72.6948 7.432C72.3348 7.432 72.0588 7.5 71.8668 7.636C71.6748 7.772 71.5788 7.952 71.5788 8.176C71.5788 8.352 71.6428 8.5 71.7708 8.62C71.8988 8.74 72.0548 8.836 72.2388 8.908C72.4228 8.972 72.6948 9.056 73.0548 9.16C73.5348 9.288 73.9268 9.42 74.2308 9.556C74.5428 9.684 74.8108 9.876 75.0348 10.132C75.2588 10.388 75.3748 10.728 75.3828 11.152C75.3828 11.528 75.2788 11.864 75.0708 12.16C74.8628 12.456 74.5668 12.688 74.1828 12.856C73.8068 13.024 73.3628 13.108 72.8508 13.108ZM79.4769 9.7L82.5249 13H80.6769L78.2289 10.156V13H76.8609V4.12H78.2289V9.28L80.6289 6.388H82.5249L79.4769 9.7Z" fill="#0CBB7D" />
                            <path d="M0 14.2H82.6089V14.8H0V14.2Z" fill="#0CBB7D" />
                          </svg>
                        </div>
                      </td>
                      <td className="border-b px-2 py-2 font-style:Poppins" >
                        {order.product}
                        <br />
                        <p className="text-[#666666]">{order.sku}</p>
                        {order.qty}
                      </td>
                      <td className="border-b px-2 py-2 font-style:Poppins">
                        {order.deadWeight}
                        <br />
                        <p className="text-[#666666]">{order.weight}</p>
                        {order.volumetricWeight}
                      </td>
                      <td className="border-b px-2 py-2 font-style:Poppins">{order.payment}<div><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></div></td>
                      <td className="border-b px-2 py-2 font-style:Poppins">{order.pickupAddress}</td>
                      <td className="border-b px-2 py-2 font-style:Poppins"> <button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button> </td>
                      <td className="  flex flex-col items-center border-b px-2 py-2 ">
                        <div className="flex flex-col items-start space-y-1 px-2 py-2">
                          <div onClick={() => handleShipOrder(order.id)}><svg margin-right="10" width="88" height="34" viewBox="0 0 88 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <mask id="mask1" x="0" y="0" width="88" height="34">
                                <rect width="88" height="34" rx="5" fill="white" />
                              </mask>
                            </defs>
                            <rect width="88" height="34" rx="5" fill="#0CBB7D" mask="url(#mask1)" />
                            <path d="M20.0755 21.084C19.4915 21.084 18.9635 20.984 18.4915 20.784C18.0275 20.584 17.6595 20.296 17.3875 19.92C17.1155 19.544 16.9755 19.1 16.9675 18.588H18.7675C18.7915 18.932 18.9115 19.204 19.1275 19.404C19.3515 19.604 19.6555 19.704 20.0395 19.704C20.4315 19.704 20.7395 19.612 20.9635 19.428C21.1875 19.236 21.2995 18.988 21.2995 18.684C21.2995 18.436 21.2235 18.232 21.0715 18.072C20.9195 17.912 20.7275 17.788 20.4955 17.7C20.2715 17.604 19.9595 17.5 19.5595 17.388C19.0155 17.228 18.5715 17.072 18.2275 16.92C17.8915 16.76 17.5995 16.524 17.3515 16.212C17.1115 15.892 16.9915 15.468 16.9915 14.94C16.9915 14.444 17.1155 14.012 17.3635 13.644C17.6115 13.276 17.9595 12.996 18.4075 12.804C18.8555 12.604 19.3675 12.504 19.9435 12.504C20.8075 12.504 21.5075 12.716 22.0435 13.14C22.5875 13.556 22.8875 14.14 22.9435 14.892H21.0955C21.0795 14.604 20.9555 14.368 20.7235 14.184C20.4995 13.992 20.1995 13.896 19.8235 13.896C19.4955 13.896 19.2315 13.98 19.0315 14.148C18.8395 14.316 18.7435 14.56 18.7435 14.88C18.7435 15.104 18.8155 15.292 18.9595 15.444C19.1115 15.588 19.2955 15.708 19.5115 15.804C19.7355 15.892 20.0475 15.996 20.4475 16.116C20.9915 16.276 21.4355 16.436 21.7795 16.596C22.1235 16.756 22.4195 16.996 22.6675 17.316C22.9155 17.636 23.0395 18.056 23.0395 18.576C23.0395 19.024 22.9235 19.44 22.6915 19.824C22.4595 20.208 22.1195 20.516 21.6715 20.748C21.2235 20.972 20.6915 21.084 20.0755 21.084ZM28.24 14.256C28.744 14.256 29.192 14.368 29.584 14.592C29.976 14.808 30.28 15.132 30.496 15.564C30.72 15.988 30.832 16.5 30.832 17.1V21H29.152V17.328C29.152 16.8 29.02 16.396 28.756 16.116C28.492 15.828 28.132 15.684 27.676 15.684C27.212 15.684 26.844 15.828 26.572 16.116C26.308 16.396 26.176 16.8 26.176 17.328V21H24.496V12.12H26.176V15.18C26.392 14.892 26.68 14.668 27.04 14.508C27.4 14.34 27.8 14.256 28.24 14.256ZM33.2816 13.56C32.9856 13.56 32.7376 13.468 32.5376 13.284C32.3456 13.092 32.2496 12.856 32.2496 12.576C32.2496 12.296 32.3456 12.064 32.5376 11.88C32.7376 11.688 32.9856 11.592 33.2816 11.592C33.5776 11.592 33.8216 11.688 34.0136 11.88C34.2136 12.064 34.3136 12.296 34.3136 12.576C34.3136 12.856 34.2136 13.092 34.0136 13.284C33.8216 13.468 33.5776 13.56 33.2816 13.56ZM34.1096 14.352V21H32.4296V14.352H34.1096ZM37.4494 15.312C37.6654 15.008 37.9614 14.756 38.3374 14.556C38.7214 14.348 39.1574 14.244 39.6454 14.244C40.2134 14.244 40.7254 14.384 41.1814 14.664C41.6454 14.944 42.0094 15.344 42.2734 15.864C42.5454 16.376 42.6814 16.972 42.6814 17.652C42.6814 18.332 42.5454 18.936 42.2734 19.464C42.0094 19.984 41.6454 20.388 41.1814 20.676C40.7254 20.964 40.2134 21.108 39.6454 21.108C39.1574 21.108 38.7254 21.008 38.3494 20.808C37.9814 20.608 37.6814 20.356 37.4494 20.052V24.168H35.7694V14.352H37.4494V15.312ZM40.9654 17.652C40.9654 17.252 40.8814 16.908 40.7134 16.62C40.5534 16.324 40.3374 16.1 40.0654 15.948C39.8014 15.796 39.5134 15.72 39.2014 15.72C38.8974 15.72 38.6094 15.8 38.3374 15.96C38.0734 16.112 37.8574 16.336 37.6894 16.632C37.5294 16.928 37.4494 17.276 37.4494 17.676C37.4494 18.076 37.5294 18.424 37.6894 18.72C37.8574 19.016 38.0734 19.244 38.3374 19.404C38.6094 19.556 38.8974 19.632 39.2014 19.632C39.5134 19.632 39.8014 19.552 40.0654 19.392C40.3374 19.232 40.5534 19.004 40.7134 18.708C40.8814 18.412 40.9654 18.06 40.9654 17.652ZM50.4456 14.256C51.2376 14.256 51.8776 14.508 52.3656 15.012C52.8536 15.508 53.0976 16.204 53.0976 17.1V21H51.4176V17.328C51.4176 16.8 51.2856 16.396 51.0216 16.116C50.7576 15.828 50.3976 15.684 49.9416 15.684C49.4776 15.684 49.1096 15.828 48.8376 16.116C48.5736 16.396 48.4416 16.8 48.4416 17.328V21H46.7616V14.352H48.4416V15.18C48.6656 14.892 48.9496 14.668 49.2936 14.508C49.6456 14.34 50.0296 14.256 50.4456 14.256ZM57.6472 21.108C57.0072 21.108 56.4312 20.968 55.9192 20.688C55.4072 20.4 55.0032 19.996 54.7072 19.476C54.4192 18.956 54.2752 18.356 54.2752 17.676C54.2752 16.996 54.4232 16.396 54.7192 15.876C55.0232 15.356 55.4352 14.956 55.9552 14.676C56.4752 14.388 57.0552 14.244 57.6952 14.244C58.3352 14.244 58.9152 14.388 59.4352 14.676C59.9552 14.956 60.3632 15.356 60.6592 15.876C60.9632 16.396 61.1152 16.996 61.1152 17.676C61.1152 18.356 60.9592 18.956 60.6472 19.476C60.3432 19.996 59.9272 20.4 59.3992 20.688C58.8792 20.968 58.2952 21.108 57.6472 21.108ZM57.6472 19.644C57.9512 19.644 58.2352 19.572 58.4992 19.428C58.7712 19.276 58.9872 19.052 59.1472 18.756C59.3072 18.46 59.3872 18.1 59.3872 17.676C59.3872 17.044 59.2192 16.56 58.8832 16.224C58.5552 15.88 58.1512 15.708 57.6712 15.708C57.1912 15.708 56.7872 15.88 56.4592 16.224C56.1392 16.56 55.9792 17.044 55.9792 17.676C55.9792 18.308 56.1352 18.796 56.4472 19.14C56.7672 19.476 57.1672 19.644 57.6472 19.644ZM71.5635 14.352L69.6195 21H67.8075L66.5955 16.356L65.3835 21H63.5595L61.6035 14.352H63.3075L64.4835 19.416L65.7555 14.352H67.5315L68.7795 19.404L69.9555 14.352H71.5635Z" fill="#FAFEFC" />
                          </svg>
                          </div>
                          <div>
                            <svg width="40" height="40" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="21" cy="21" r="21" fill="#0CBB7D" />
                              <g>
                                <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white" />
                                <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white" />
                                <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Ready To Ship" && (
                    <>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]"> <div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2">{order.orderDetails}</p>
                          <p className="text-[#666666]">{order.Date}</p>
                          <p>{order.type}</p>
                        </div></div></td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]">{order.customerName}<p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]">{order.payment} <div><button className="bg-[#EBF7E8] text-[#D71D1D] rounded-lg px-1 py-1">{order.paymentStatus}</button></div></td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]">{order.pickupAddress}</td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]"><p>{order.shippingDetails}</p>
                        <p className="text-[#666666] font-style:Poppins">{order.shipmentBill}</p>
                        <p>{order.pickId}</p></td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button></td>
                      <td className="border-b px-2 py-2 font-style:Poppins text-[#1A1A1A]">
                        <button
                          className="bg-[#0CBB7D] text-white py-2 px-3 rounded-lg transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Download
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Pick ups" && (
                    <>
                      <td className="border-b px-1 py-1"><div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2">{order.pickId}</p>
                          <p className="text-[#666666] space-x-1 "> {order.pickRequestDate} | {order.time}</p>
                        </div>
                      </div>
                      </td>
                      <td className="border-b px-1 py-1">{order.shipmentCount}</td>
                      <td className="border-b px-1 py-1">{order.pickupAddress}</td>
                      <td className="border-b px-1 py-1">{order.parentCourier}</td>
                      <td className="border-b px-1 py-1"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.pickupStatus}</button><p className="text-[#666666]">{order.shipDate}</p></td>
                      <td className="border-b px-1 py-1">
                        <div className="flex flex-col items-start space-y-1 px-2 py-2">
                          <svg width="141" height="34" viewBox="0 0 141 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="141" height="34" rx="5" fill="#0CBB7D" />
                            <path d="M20.004 12.624C20.884 12.624 21.656 12.796 22.32 13.14C22.992 13.484 23.508 13.976 23.868 14.616C24.236 15.248 24.42 15.984 24.42 16.824C24.42 17.664 24.236 18.4 23.868 19.032C23.508 19.656 22.992 20.14 22.32 20.484C21.656 20.828 20.884 21 20.004 21H17.076V12.624H20.004ZM19.944 19.572C20.824 19.572 21.504 19.332 21.984 18.852C22.464 18.372 22.704 17.696 22.704 16.824C22.704 15.952 22.464 15.272 21.984 14.784C21.504 14.288 20.824 14.04 19.944 14.04H18.756V19.572H19.944ZM28.6296 21.108C27.9896 21.108 27.4136 20.968 26.9016 20.688C26.3896 20.4 25.9856 19.996 25.6896 19.476C25.4016 18.956 25.2576 18.356 25.2576 17.676C25.2576 16.996 25.4056 16.396 25.7016 15.876C26.0056 15.356 26.4176 14.956 26.9376 14.676C27.4576 14.388 28.0376 14.244 28.6776 14.244C29.3176 14.244 29.8976 14.388 30.4176 14.676C30.9376 14.956 31.3456 15.356 31.6416 15.876C31.9456 16.396 32.0976 16.996 32.0976 17.676C32.0976 18.356 31.9416 18.956 31.6296 19.476C31.3256 19.996 30.9096 20.4 30.3816 20.688C29.8616 20.968 29.2776 21.108 28.6296 21.108ZM28.6296 19.644C28.9336 19.644 29.2176 19.572 29.4816 19.428C29.7536 19.276 29.9696 19.052 30.1296 18.756C30.2896 18.46 30.3696 18.1 30.3696 17.676C30.3696 17.044 30.2016 16.56 29.8656 16.224C29.5376 15.88 29.1336 15.708 28.6536 15.708C28.1736 15.708 27.7696 15.88 27.4416 16.224C27.1216 16.56 26.9616 17.044 26.9616 17.676C26.9616 18.308 27.1176 18.796 27.4296 19.14C27.7496 19.476 28.1496 19.644 28.6296 19.644ZM42.546 14.352L40.602 21H38.79L37.578 16.356L36.366 21H34.542L32.586 14.352H34.29L35.466 19.416L36.738 14.352H38.514L39.762 19.404L40.938 14.352H42.546ZM47.139 14.256C47.931 14.256 48.571 14.508 49.059 15.012C49.547 15.508 49.791 16.204 49.791 17.1V21H48.111V17.328C48.111 16.8 47.979 16.396 47.715 16.116C47.451 15.828 47.091 15.684 46.635 15.684C46.171 15.684 45.803 15.828 45.531 16.116C45.267 16.396 45.135 16.8 45.135 17.328V21H43.455V14.352H45.135V15.18C45.359 14.892 45.643 14.668 45.987 14.508C46.339 14.34 46.723 14.256 47.139 14.256ZM53.0685 12.12V21H51.3885V12.12H53.0685ZM57.6804 21.108C57.0404 21.108 56.4644 20.968 55.9524 20.688C55.4404 20.4 55.0364 19.996 54.7404 19.476C54.4524 18.956 54.3084 18.356 54.3084 17.676C54.3084 16.996 54.4564 16.396 54.7524 15.876C55.0564 15.356 55.4684 14.956 55.9884 14.676C56.5084 14.388 57.0884 14.244 57.7284 14.244C58.3684 14.244 58.9484 14.388 59.4684 14.676C59.9884 14.956 60.3964 15.356 60.6924 15.876C60.9964 16.396 61.1484 16.996 61.1484 17.676C61.1484 18.356 60.9924 18.956 60.6804 19.476C60.3764 19.996 59.9604 20.4 59.4324 20.688C58.9124 20.968 58.3284 21.108 57.6804 21.108ZM57.6804 19.644C57.9844 19.644 58.2684 19.572 58.5324 19.428C58.8044 19.276 59.0204 19.052 59.1804 18.756C59.3404 18.46 59.4204 18.1 59.4204 17.676C59.4204 17.044 59.2524 16.56 58.9164 16.224C58.5884 15.88 58.1844 15.708 57.7044 15.708C57.2244 15.708 56.8204 15.88 56.4924 16.224C56.1724 16.56 56.0124 17.044 56.0124 17.676C56.0124 18.308 56.1684 18.796 56.4804 19.14C56.8004 19.476 57.2004 19.644 57.6804 19.644ZM61.9487 17.652C61.9487 16.98 62.0807 16.384 62.3447 15.864C62.6167 15.344 62.9807 14.944 63.4367 14.664C63.9007 14.384 64.4167 14.244 64.9847 14.244C65.4807 14.244 65.9127 14.344 66.2807 14.544C66.6567 14.744 66.9567 14.996 67.1807 15.3V14.352H68.8727V21H67.1807V20.028C66.9647 20.34 66.6647 20.6 66.2807 20.808C65.9047 21.008 65.4687 21.108 64.9727 21.108C64.4127 21.108 63.9007 20.964 63.4367 20.676C62.9807 20.388 62.6167 19.984 62.3447 19.464C62.0807 18.936 61.9487 18.332 61.9487 17.652ZM67.1807 17.676C67.1807 17.268 67.1007 16.92 66.9407 16.632C66.7807 16.336 66.5647 16.112 66.2927 15.96C66.0207 15.8 65.7287 15.72 65.4167 15.72C65.1047 15.72 64.8167 15.796 64.5527 15.948C64.2887 16.1 64.0727 16.324 63.9047 16.62C63.7447 16.908 63.6647 17.252 63.6647 17.652C63.6647 18.052 63.7447 18.404 63.9047 18.708C64.0727 19.004 64.2887 19.232 64.5527 19.392C64.8247 19.552 65.1127 19.632 65.4167 19.632C65.7287 19.632 66.0207 19.556 66.2927 19.404C66.5647 19.244 66.7807 19.02 66.9407 18.732C67.1007 18.436 67.1807 18.084 67.1807 17.676ZM70.0815 17.652C70.0815 16.98 70.2135 16.384 70.4775 15.864C70.7495 15.344 71.1175 14.944 71.5815 14.664C72.0455 14.384 72.5615 14.244 73.1295 14.244C73.5615 14.244 73.9735 14.34 74.3655 14.532C74.7575 14.716 75.0695 14.964 75.3015 15.276V12.12H77.0055V21H75.3015V20.016C75.0935 20.344 74.8015 20.608 74.4255 20.808C74.0495 21.008 73.6135 21.108 73.1175 21.108C72.5575 21.108 72.0455 20.964 71.5815 20.676C71.1175 20.388 70.7495 19.984 70.4775 19.464C70.2135 18.936 70.0815 18.332 70.0815 17.652ZM75.3135 17.676C75.3135 17.268 75.2335 16.92 75.0735 16.632C74.9135 16.336 74.6975 16.112 74.4255 15.96C74.1535 15.8 73.8615 15.72 73.5495 15.72C73.2375 15.72 72.9495 15.796 72.6855 15.948C72.4215 16.1 72.2055 16.324 72.0375 16.62C71.8775 16.908 71.7975 17.252 71.7975 17.652C71.7975 18.052 71.8775 18.404 72.0375 18.708C72.2055 19.004 72.4215 19.232 72.6855 19.392C72.9575 19.552 73.2455 19.632 73.5495 19.632C73.8615 19.632 74.1535 19.556 74.4255 19.404C74.6975 19.244 74.9135 19.02 75.0735 18.732C75.2335 18.436 75.3135 18.084 75.3135 17.676ZM82.3577 13.56C82.0617 13.56 81.8137 13.468 81.6137 13.284C81.4217 13.092 81.3257 12.856 81.3257 12.576C81.3257 12.296 81.4217 12.064 81.6137 11.88C81.8137 11.688 82.0617 11.592 82.3577 11.592C82.6537 11.592 82.8977 11.688 83.0897 11.88C83.2897 12.064 83.3897 12.296 83.3897 12.576C83.3897 12.856 83.2897 13.092 83.0897 13.284C82.8977 13.468 82.6537 13.56 82.3577 13.56ZM83.1857 14.352V21H81.5057V14.352H83.1857ZM88.5296 14.256C89.3216 14.256 89.9616 14.508 90.4496 15.012C90.9376 15.508 91.1816 16.204 91.1816 17.1V21H89.5016V17.328C89.5016 16.8 89.3696 16.396 89.1056 16.116C88.8416 15.828 88.4816 15.684 88.0256 15.684C87.5616 15.684 87.1936 15.828 86.9216 16.116C86.6576 16.396 86.5256 16.8 86.5256 17.328V21H84.8456V14.352H86.5256V15.18C86.7496 14.892 87.0336 14.668 87.3776 14.508C87.7296 14.34 88.1136 14.256 88.5296 14.256ZM95.5512 19.452L97.2312 14.352H99.0192L96.5592 21H94.5192L92.0712 14.352H93.8712L95.5512 19.452ZM102.915 21.108C102.275 21.108 101.699 20.968 101.187 20.688C100.675 20.4 100.271 19.996 99.9748 19.476C99.6868 18.956 99.5428 18.356 99.5428 17.676C99.5428 16.996 99.6908 16.396 99.9868 15.876C100.291 15.356 100.703 14.956 101.223 14.676C101.743 14.388 102.323 14.244 102.963 14.244C103.603 14.244 104.183 14.388 104.703 14.676C105.223 14.956 105.631 15.356 105.927 15.876C106.231 16.396 106.383 16.996 106.383 17.676C106.383 18.356 106.227 18.956 105.915 19.476C105.611 19.996 105.195 20.4 104.667 20.688C104.147 20.968 103.563 21.108 102.915 21.108ZM102.915 19.644C103.219 19.644 103.503 19.572 103.767 19.428C104.039 19.276 104.255 19.052 104.415 18.756C104.575 18.46 104.655 18.1 104.655 17.676C104.655 17.044 104.487 16.56 104.151 16.224C103.823 15.88 103.419 15.708 102.939 15.708C102.459 15.708 102.055 15.88 101.727 16.224C101.407 16.56 101.247 17.044 101.247 17.676C101.247 18.308 101.403 18.796 101.715 19.14C102.035 19.476 102.435 19.644 102.915 19.644ZM108.467 13.56C108.171 13.56 107.923 13.468 107.723 13.284C107.531 13.092 107.435 12.856 107.435 12.576C107.435 12.296 107.531 12.064 107.723 11.88C107.923 11.688 108.171 11.592 108.467 11.592C108.763 11.592 109.007 11.688 109.199 11.88C109.399 12.064 109.499 12.296 109.499 12.576C109.499 12.856 109.399 13.092 109.199 13.284C109.007 13.468 108.763 13.56 108.467 13.56ZM109.295 14.352V21H107.615V14.352H109.295ZM110.523 17.676C110.523 16.988 110.663 16.388 110.943 15.876C111.223 15.356 111.611 14.956 112.107 14.676C112.603 14.388 113.171 14.244 113.811 14.244C114.635 14.244 115.315 14.452 115.851 14.868C116.395 15.276 116.759 15.852 116.943 16.596H115.131C115.035 16.308 114.871 16.084 114.639 15.924C114.415 15.756 114.135 15.672 113.799 15.672C113.319 15.672 112.939 15.848 112.659 16.2C112.379 16.544 112.239 17.036 112.239 17.676C112.239 18.308 112.379 18.8 112.659 19.152C112.939 19.496 113.319 19.668 113.799 19.668C114.479 19.668 114.923 19.364 115.131 18.756H116.943C116.759 19.476 116.395 20.048 115.851 20.472C115.307 20.896 114.627 21.108 113.811 21.108C113.171 21.108 112.603 20.968 112.107 20.688C111.611 20.4 111.223 20 110.943 19.488C110.663 18.968 110.523 18.364 110.523 17.676ZM124.354 17.532C124.354 17.772 124.338 17.988 124.306 18.18H119.446C119.486 18.66 119.654 19.036 119.95 19.308C120.246 19.58 120.61 19.716 121.042 19.716C121.666 19.716 122.11 19.448 122.374 18.912H124.186C123.994 19.552 123.626 20.08 123.082 20.496C122.538 20.904 121.87 21.108 121.078 21.108C120.438 21.108 119.862 20.968 119.35 20.688C118.846 20.4 118.45 19.996 118.162 19.476C117.882 18.956 117.742 18.356 117.742 17.676C117.742 16.988 117.882 16.384 118.162 15.864C118.442 15.344 118.834 14.944 119.338 14.664C119.842 14.384 120.422 14.244 121.078 14.244C121.71 14.244 122.274 14.38 122.77 14.652C123.274 14.924 123.662 15.312 123.934 15.816C124.214 16.312 124.354 16.884 124.354 17.532ZM122.614 17.052C122.606 16.62 122.45 16.276 122.146 16.02C121.842 15.756 121.47 15.624 121.03 15.624C120.614 15.624 120.262 15.752 119.974 16.008C119.694 16.256 119.522 16.604 119.458 17.052H122.614Z" fill="#FAFEFC" />
                          </svg>
                          <div>
                            <svg width="40" height="40" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="21" cy="21" r="21" fill="#0CBB7D" />
                              <g>
                                <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white" />
                                <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white" />
                                <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  {selectedStatus === "In Transit" && (
                    <>
                      <td className="border-b px-2 py-2"><div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                          <p className="text-[#666666]">{order.Date} | {order.time}</p>
                          <p>{order.type}</p>
                          <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                            <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                          </svg>
                          </p>
                        </div></div></td>
                      <td className="border-b px-2 py-2">{order.customerName} <p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.payment}<p><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></p></td>
                      <td className="border-b px-2 py-2">{order.shippingDetails} <br />
                        <p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}><p className="text-[#1A1A1A]">AWS #</p>{order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <mask id="mask1" x="0" y="0" width="13" height="13">
                              <rect width="13" height="13" fill="#D9D9D9" />
                            </mask>
                          </defs>
                          <g mask="url(#mask0_1117_24188)">
                            <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                          </g>
                        </svg>
                        </p>
                      </td>
                      <td className="border-b px-2 py-2">{order.ShippedDate}</td>
                      <td className="border-b px-2 py-2"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button></td>
                      <td className="border-b px-2 py-2">
                        <div className="flex flex-col items-start space-y-1 px-1 py-1">
                          <button
                            className="bg-[#0CBB7D] text-white py-2 px-4 rounded-lg transition duration-300"
                            onClick={() => handleShipOrder(order.id)}
                          >
                            Track Order
                          </button>
                          <div>
                            <svg width="40" height="40" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="21" cy="21" r="21" fill="#0CBB7D" />
                              <g>
                                <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white" />
                                <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white" />
                                <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Delivered" && (
                    <>
                      <td className="border-b px-2 py-2"><div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                          <p className="text-[#666666]">{order.Date} | {order.time}</p>
                          <p>{order.type}</p>
                          <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                            <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                          </svg>
                          </p>
                        </div></div></td>
                      <td className="border-b px-2 py-2">{order.customerName} <p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.payment} <p><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></p></td>
                      <td className="border-b px-2 py-2">{order.shippingDetails} <br />
                        <p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}> <p className="text-[#1A1A1A]">AWS #</p> {order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <mask id="mask1" x="0" y="0" width="13" height="13">
                              <rect width="13" height="13" fill="#D9D9D9" />
                            </mask>
                          </defs>
                          <g mask="url(#mask0_1117_24188)">
                            <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                          </g>
                        </svg>
                        </p>
                      </td>
                      <td className="border-b px-2 py-2"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button><p className="text-[#666666]">{order.ShippedDate}</p></td>
                      <td className="border-b px-2 py-2">
                        <button
                          className="bg-[#E9E9E9] text-[#666666] font-semibold py-2 px-4 rounded-lg hover:bg-[#0CBB7D] transition duration-300"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          Create Return
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "RTO" && (
                    <>
                      <td className="border-b px-2 py-2"><div className="flex space-x-2">
                        <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                          className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                        <div>
                          <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                          <p className="text-[#666666]">{order.Date} | {order.time}</p>
                          <p>{order.type}</p>
                          <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                            <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                          </svg>
                          </p>
                        </div></div></td>
                      <td className="border-b px-2 py-2">{order.customerName} <p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.orderedShippedDate}</td>
                      <td className="border-b px-2 py-2">{order.shippingDetails}<br /><p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}> <p className="text-[#1A1A1A]">AWS #</p> {order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <mask id="mask1" x="0" y="0" width="13" height="13">
                            <rect width="13" height="13" fill="#D9D9D9" />
                          </mask>
                        </defs>
                        <g mask="url(#mask0_1117_24188)">
                          <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                        </g>
                      </svg>
                      </p></td>
                      <td className="border-b px-2 py-2">{order.rtoEDD}</td>
                      <td className="border-b px-2 py-2">{order.rtoAddress}</td>
                      <td className="border-b px-2 py-2"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button><p className="text-[#666666]">{order.ShippedDate}</p></td>
                      <td className="border-b px-2 py-2">
                        <button
                          className="text-white py-2 px-2  "
                          onClick={() => handleShipOrder(order.id)}
                        >
                          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="21" fill="#0CBB7D" />
                            <g>
                              <path d="M15 23C14.45 23 13.9792 22.8042 13.5875 22.4125C13.1958 22.0208 13 21.55 13 21C13 20.45 13.1958 19.9792 13.5875 19.5875C13.9792 19.1958 14.45 19 15 19C15.55 19 16.0208 19.1958 16.4125 19.5875C16.8042 19.9792 17 20.45 17 21C17 21.55 16.8042 22.0208 16.4125 22.4125C16.0208 22.8042 15.55 23 15 23Z" fill="white" />
                              <path d="M21 23C20.45 23 19.9792 22.8042 19.5875 22.4125C19.1958 22.0208 19 21.55 19 21C19 20.45 19.1958 19.9792 19.5875 19.5875C19.9792 19.1958 20.45 19 21 19C21.55 19 22.0208 19.1958 22.4125 19.5875C22.8042 19.9792 23 20.45 23 21C23 21.55 22.8042 22.0208 22.4125 22.4125C22.0208 22.8042 21.55 23 21 23Z" fill="white" />
                              <path d="M27 23C26.45 23 25.9792 22.8042 25.5875 22.4125C25.1958 22.0208 25 21.55 25 21C25 20.45 25.1958 19.9792 25.5875 19.5875C25.9792 19.1958 26.45 19 27 19C27.55 19 28.0208 19.1958 28.4125 19.5875C28.8042 19.9792 29 20.45 29 21C29 21.55 28.8042 22.0208 28.4125 22.4125C28.0208 22.8042 27.55 23 27 23Z" fill="white" />
                            </g>
                          </svg>
                        </button>
                      </td>
                    </>
                  )}

                  {selectedStatus === "Cancelled" && (
                    <>
                      {selectedStatus === "Cancelled" && (
                        <td className="border-b px-2 py-2">
                          <div className="flex space-x-2">
                            <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                              className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                            <div>
                              <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                              <p className="text-[#666666]">{order.Date} | {order.time}</p>
                              <p>{order.type}</p>
                              <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                                <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                              </svg>
                              </p>
                            </div></div>
                        </td>
                      )}
                      <td className="border-b px-2 py-2">{order.customerName} <p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.payment}<p><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></p></td>
                      <td className="border-b px-2 py-2">{order.rtoAddress}</td>
                      <td className="border-b px-2 py-2">{order.shippingDetails}<br /><p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}> <p className="text-[#1A1A1A]">AWS #</p>{order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <mask id="mask1" x="0" y="0" width="13" height="13">
                            <rect width="13" height="13" fill="#D9D9D9" />
                          </mask>
                        </defs>
                        <g mask="url(#mask0_1117_24188)">
                          <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                        </g>
                      </svg>
                      </p></td>
                      <td className="border-b px-2 py-2"><button className="bg-[#D0362B] text-[#E8E8E8] rounded-lg px-1 py-1">{order.status}</button></td>
                      <td className="border-b px-2 py-2">
                        <button
                          className="bg-[#0CBB7D] text-white py-2 px-2 rounded-lg"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          Clone Order
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "Lost/Damage" && (
                    <>
                      <td className="border-b px-2 py-2">
                        <div className="flex space-x-2">
                          <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                            className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                          <div>
                            <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                            <p className="text-[#666666]">{order.Date} | {order.time}</p>
                            <p>{order.type}</p>
                            <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                              <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                            </svg>
                            </p>
                          </div></div>
                      </td>
                      <td className="border-b px-4 py-2">{order.customerName}<p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.payment}<p><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></p></td>
                      <td className="border-b px-2 py-2">{order.rtoAddress}</td>
                      <td className="border-b px-2 py-2">{order.shippingDetails}<br /><p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}> <p className="text-[#1A1A1A]">AWS #</p>{order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <mask id="mask1" x="0" y="0" width="13" height="13">
                            <rect width="13" height="13" fill="#D9D9D9" />
                          </mask>
                        </defs>
                        <g mask="url(#mask0_1117_24188)">
                          <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                        </g>
                      </svg>
                      </p></td>
                      <td className="border-b px-2 py-2"><button className="bg-[#D0362B] text-[#E8E8E8] rounded-lg px-1 py-1">{order.status}</button><p>View More</p><p><svg width="126" height="12" viewBox="0 0 126 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.936 4.06C6.72 3.644 6.42 3.332 6.036 3.124C5.652 2.908 5.208 2.8 4.704 2.8C4.152 2.8 3.66 2.924 3.228 3.172C2.796 3.42 2.456 3.772 2.208 4.228C1.968 4.684 1.848 5.212 1.848 5.812C1.848 6.412 1.968 6.944 2.208 7.408C2.456 7.864 2.796 8.216 3.228 8.464C3.66 8.712 4.152 8.836 4.704 8.836C5.448 8.836 6.052 8.628 6.516 8.212C6.98 7.796 7.264 7.232 7.368 6.52H4.236V5.428H8.832V6.496C8.744 7.144 8.512 7.74 8.136 8.284C7.768 8.828 7.284 9.264 6.684 9.592C6.092 9.912 5.432 10.072 4.704 10.072C3.92 10.072 3.204 9.892 2.556 9.532C1.908 9.164 1.392 8.656 1.008 8.008C0.632 7.36 0.444 6.628 0.444 5.812C0.444 4.996 0.632 4.264 1.008 3.616C1.392 2.968 1.908 2.464 2.556 2.104C3.212 1.736 3.928 1.552 4.704 1.552C5.592 1.552 6.38 1.772 7.068 2.212C7.764 2.644 8.268 3.26 8.58 4.06H6.936ZM16.2413 6.532C16.2413 6.78 16.2253 7.004 16.1933 7.204H11.1413C11.1813 7.732 11.3773 8.156 11.7293 8.476C12.0813 8.796 12.5133 8.956 13.0253 8.956C13.7613 8.956 14.2813 8.648 14.5853 8.032H16.0612C15.8613 8.64 15.4973 9.14 14.9693 9.532C14.4493 9.916 13.8013 10.108 13.0253 10.108C12.3933 10.108 11.8253 9.968 11.3213 9.688C10.8253 9.4 10.4333 9 10.1453 8.488C9.86525 7.968 9.72525 7.368 9.72525 6.688C9.72525 6.008 9.86125 5.412 10.1333 4.9C10.4133 4.38 10.8013 3.98 11.2973 3.7C11.8013 3.42 12.3773 3.28 13.0253 3.28C13.6493 3.28 14.2053 3.416 14.6933 3.688C15.1813 3.96 15.5613 4.344 15.8333 4.84C16.1053 5.328 16.2413 5.892 16.2413 6.532ZM14.8133 6.1C14.8053 5.596 14.6253 5.192 14.2733 4.888C13.9213 4.584 13.4853 4.432 12.9653 4.432C12.4933 4.432 12.0893 4.584 11.7533 4.888C11.4173 5.184 11.2173 5.588 11.1533 6.1H14.8133ZM19.1835 4.504V8.164C19.1835 8.412 19.2395 8.592 19.3515 8.704C19.4715 8.808 19.6715 8.86 19.9515 8.86H20.7915V10H19.7115C19.0955 10 18.6235 9.856 18.2955 9.568C17.9675 9.28 17.8035 8.812 17.8035 8.164V4.504H17.0235V3.388H17.8035V1.744H19.1835V3.388H20.7915V4.504H19.1835ZM24.8095 2.5V1.252H27.3055V10H25.9255V2.5H24.8095ZM29.1848 5.512C29.1848 4.128 29.4168 3.048 29.8808 2.272C30.3528 1.488 31.1608 1.096 32.3048 1.096C33.4488 1.096 34.2528 1.488 34.7168 2.272C35.1888 3.048 35.4248 4.128 35.4248 5.512C35.4248 6.912 35.1888 8.008 34.7168 8.8C34.2528 9.584 33.4488 9.976 32.3048 9.976C31.1608 9.976 30.3528 9.584 29.8808 8.8C29.4168 8.008 29.1848 6.912 29.1848 5.512ZM34.0808 5.512C34.0808 4.864 34.0368 4.316 33.9488 3.868C33.8688 3.42 33.7008 3.056 33.4448 2.776C33.1888 2.488 32.8088 2.344 32.3048 2.344C31.8008 2.344 31.4208 2.488 31.1648 2.776C30.9088 3.056 30.7368 3.42 30.6488 3.868C30.5688 4.316 30.5288 4.864 30.5288 5.512C30.5288 6.184 30.5688 6.748 30.6488 7.204C30.7288 7.66 30.8968 8.028 31.1528 8.308C31.4168 8.588 31.8008 8.728 32.3048 8.728C32.8088 8.728 33.1888 8.588 33.4448 8.308C33.7088 8.028 33.8808 7.66 33.9608 7.204C34.0408 6.748 34.0808 6.184 34.0808 5.512ZM36.8723 5.512C36.8723 4.128 37.1043 3.048 37.5683 2.272C38.0403 1.488 38.8483 1.096 39.9923 1.096C41.1363 1.096 41.9403 1.488 42.4043 2.272C42.8763 3.048 43.1123 4.128 43.1123 5.512C43.1123 6.912 42.8763 8.008 42.4043 8.8C41.9403 9.584 41.1363 9.976 39.9923 9.976C38.8483 9.976 38.0403 9.584 37.5683 8.8C37.1043 8.008 36.8723 6.912 36.8723 5.512ZM41.7683 5.512C41.7683 4.864 41.7243 4.316 41.6363 3.868C41.5563 3.42 41.3883 3.056 41.1323 2.776C40.8763 2.488 40.4963 2.344 39.9923 2.344C39.4883 2.344 39.1083 2.488 38.8523 2.776C38.5963 3.056 38.4243 3.42 38.3363 3.868C38.2563 4.316 38.2163 4.864 38.2163 5.512C38.2163 6.184 38.2563 6.748 38.3363 7.204C38.4163 7.66 38.5843 8.028 38.8403 8.308C39.1043 8.588 39.4883 8.728 39.9923 8.728C40.4963 8.728 40.8763 8.588 41.1323 8.308C41.3963 8.028 41.5683 7.66 41.6483 7.204C41.7283 6.748 41.7683 6.184 41.7683 5.512ZM44.3438 3.364C44.3438 2.78 44.5118 2.324 44.8478 1.996C45.1918 1.66 45.6318 1.492 46.1678 1.492C46.7038 1.492 47.1398 1.66 47.4758 1.996C47.8198 2.324 47.9918 2.78 47.9918 3.364C47.9918 3.948 47.8198 4.408 47.4758 4.744C47.1398 5.08 46.7038 5.248 46.1678 5.248C45.6318 5.248 45.1918 5.08 44.8478 4.744C44.5118 4.408 44.3438 3.948 44.3438 3.364ZM51.6638 1.648L46.8758 10H45.5318L50.3198 1.648H51.6638ZM46.1678 2.32C45.6638 2.32 45.4118 2.668 45.4118 3.364C45.4118 4.068 45.6638 4.42 46.1678 4.42C46.4078 4.42 46.5918 4.336 46.7198 4.168C46.8558 3.992 46.9238 3.724 46.9238 3.364C46.9238 2.668 46.6718 2.32 46.1678 2.32ZM49.2278 8.272C49.2278 7.688 49.3958 7.232 49.7318 6.904C50.0758 6.568 50.5158 6.4 51.0518 6.4C51.5798 6.4 52.0118 6.568 52.3478 6.904C52.6918 7.232 52.8638 7.688 52.8638 8.272C52.8638 8.856 52.6918 9.316 52.3478 9.652C52.0118 9.988 51.5798 10.156 51.0518 10.156C50.5158 10.156 50.0758 9.988 49.7318 9.652C49.3958 9.316 49.2278 8.856 49.2278 8.272ZM51.0398 7.228C50.5358 7.228 50.2838 7.576 50.2838 8.272C50.2838 8.968 50.5358 9.316 51.0398 9.316C51.5438 9.316 51.7958 8.968 51.7958 8.272C51.7958 7.576 51.5438 7.228 51.0398 7.228ZM56.9284 5.812C56.9284 4.996 57.1164 4.264 57.4924 3.616C57.8764 2.968 58.3924 2.464 59.0404 2.104C59.6964 1.736 60.4124 1.552 61.1884 1.552C62.0764 1.552 62.8644 1.772 63.5524 2.212C64.2484 2.644 64.7524 3.26 65.0644 4.06H63.4204C63.2044 3.62 62.9044 3.292 62.5204 3.076C62.1364 2.86 61.6924 2.752 61.1884 2.752C60.6364 2.752 60.1444 2.876 59.7124 3.124C59.2804 3.372 58.9404 3.728 58.6924 4.192C58.4524 4.656 58.3324 5.196 58.3324 5.812C58.3324 6.428 58.4524 6.968 58.6924 7.432C58.9404 7.896 59.2804 8.256 59.7124 8.512C60.1444 8.76 60.6364 8.884 61.1884 8.884C61.6924 8.884 62.1364 8.776 62.5204 8.56C62.9044 8.344 63.2044 8.016 63.4204 7.576H65.0644C64.7524 8.376 64.2484 8.992 63.5524 9.424C62.8644 9.856 62.0764 10.072 61.1884 10.072C60.4044 10.072 59.6884 9.892 59.0404 9.532C58.3924 9.164 57.8764 8.656 57.4924 8.008C57.1164 7.36 56.9284 6.628 56.9284 5.812ZM68.0336 1.12V10H66.6656V1.12H68.0336ZM69.3737 6.664C69.3737 6 69.5097 5.412 69.7817 4.9C70.0617 4.388 70.4377 3.992 70.9097 3.712C71.3897 3.424 71.9177 3.28 72.4937 3.28C73.0137 3.28 73.4657 3.384 73.8497 3.592C74.2417 3.792 74.5537 4.044 74.7857 4.348V3.388H76.1657V10H74.7857V9.016C74.5537 9.328 74.2377 9.588 73.8377 9.796C73.4377 10.004 72.9817 10.108 72.4697 10.108C71.9017 10.108 71.3817 9.964 70.9097 9.676C70.4377 9.38 70.0617 8.972 69.7817 8.452C69.5097 7.924 69.3737 7.328 69.3737 6.664ZM74.7857 6.688C74.7857 6.232 74.6897 5.836 74.4977 5.5C74.3137 5.164 74.0697 4.908 73.7657 4.732C73.4617 4.556 73.1337 4.468 72.7817 4.468C72.4297 4.468 72.1017 4.556 71.7977 4.732C71.4937 4.9 71.2457 5.152 71.0537 5.488C70.8697 5.816 70.7777 6.208 70.7777 6.664C70.7777 7.12 70.8697 7.52 71.0537 7.864C71.2457 8.208 71.4937 8.472 71.7977 8.656C72.1097 8.832 72.4377 8.92 72.7817 8.92C73.1337 8.92 73.4617 8.832 73.7657 8.656C74.0697 8.48 74.3137 8.224 74.4977 7.888C74.6897 7.544 74.7857 7.144 74.7857 6.688ZM78.6585 2.512C78.4105 2.512 78.2025 2.428 78.0345 2.26C77.8665 2.092 77.7825 1.884 77.7825 1.636C77.7825 1.388 77.8665 1.18 78.0345 1.012C78.2025 0.844 78.4105 0.76 78.6585 0.76C78.8985 0.76 79.1025 0.844 79.2705 1.012C79.4385 1.18 79.5225 1.388 79.5225 1.636C79.5225 1.884 79.4385 2.092 79.2705 2.26C79.1025 2.428 78.8985 2.512 78.6585 2.512ZM79.3305 3.388V10H77.9625V3.388H79.3305ZM89.1306 3.28C89.6506 3.28 90.1146 3.388 90.5226 3.604C90.9386 3.82 91.2626 4.14 91.4946 4.564C91.7346 4.988 91.8546 5.5 91.8546 6.1V10H90.4986V6.304C90.4986 5.712 90.3506 5.26 90.0546 4.948C89.7586 4.628 89.3546 4.468 88.8426 4.468C88.3306 4.468 87.9226 4.628 87.6186 4.948C87.3226 5.26 87.1746 5.712 87.1746 6.304V10H85.8186V6.304C85.8186 5.712 85.6706 5.26 85.3746 4.948C85.0786 4.628 84.6746 4.468 84.1626 4.468C83.6506 4.468 83.2426 4.628 82.9386 4.948C82.6426 5.26 82.4946 5.712 82.4946 6.304V10H81.1266V3.388H82.4946V4.144C82.7186 3.872 83.0026 3.66 83.3466 3.508C83.6906 3.356 84.0586 3.28 84.4506 3.28C84.9786 3.28 85.4506 3.392 85.8666 3.616C86.2826 3.84 86.6026 4.164 86.8266 4.588C87.0266 4.188 87.3386 3.872 87.7626 3.64C88.1866 3.4 88.6426 3.28 89.1306 3.28ZM98.0805 4.372C98.3125 4.052 98.6285 3.792 99.0285 3.592C99.4365 3.384 99.8885 3.28 100.385 3.28C100.969 3.28 101.497 3.42 101.969 3.7C102.441 3.98 102.813 4.38 103.085 4.9C103.357 5.412 103.493 6 103.493 6.664C103.493 7.328 103.357 7.924 103.085 8.452C102.813 8.972 102.437 9.38 101.957 9.676C101.485 9.964 100.961 10.108 100.385 10.108C99.8725 10.108 99.4165 10.008 99.0165 9.808C98.6245 9.608 98.3125 9.352 98.0805 9.04V10H96.7125V1.12H98.0805V4.372ZM102.101 6.664C102.101 6.208 102.005 5.816 101.812 5.488C101.629 5.152 101.381 4.9 101.069 4.732C100.765 4.556 100.437 4.468 100.085 4.468C99.7405 4.468 99.4125 4.556 99.1005 4.732C98.7965 4.908 98.5485 5.164 98.3565 5.5C98.1725 5.836 98.0805 6.232 98.0805 6.688C98.0805 7.144 98.1725 7.544 98.3565 7.888C98.5485 8.224 98.7965 8.48 99.1005 8.656C99.4125 8.832 99.7405 8.92 100.085 8.92C100.437 8.92 100.765 8.832 101.069 8.656C101.381 8.472 101.629 8.208 101.812 7.864C102.005 7.52 102.101 7.12 102.101 6.664ZM104.389 6.664C104.389 6 104.525 5.412 104.797 4.9C105.077 4.388 105.453 3.992 105.925 3.712C106.405 3.424 106.933 3.28 107.509 3.28C108.029 3.28 108.481 3.384 108.865 3.592C109.257 3.792 109.569 4.044 109.801 4.348V3.388H111.181V10H109.801V9.016C109.569 9.328 109.253 9.588 108.853 9.796C108.453 10.004 107.997 10.108 107.485 10.108C106.917 10.108 106.397 9.964 105.925 9.676C105.453 9.38 105.077 8.972 104.797 8.452C104.525 7.924 104.389 7.328 104.389 6.664ZM109.801 6.688C109.801 6.232 109.705 5.836 109.513 5.5C109.329 5.164 109.085 4.908 108.781 4.732C108.477 4.556 108.149 4.468 107.797 4.468C107.445 4.468 107.117 4.556 106.813 4.732C106.509 4.9 106.261 5.152 106.069 5.488C105.885 5.816 105.793 6.208 105.793 6.664C105.793 7.12 105.885 7.52 106.069 7.864C106.261 8.208 106.509 8.472 106.813 8.656C107.125 8.832 107.453 8.92 107.797 8.92C108.149 8.92 108.477 8.832 108.781 8.656C109.085 8.48 109.329 8.224 109.513 7.888C109.705 7.544 109.801 7.144 109.801 6.688ZM112.522 6.688C112.522 6.008 112.658 5.412 112.93 4.9C113.21 4.38 113.594 3.98 114.082 3.7C114.57 3.42 115.13 3.28 115.762 3.28C116.562 3.28 117.222 3.472 117.742 3.856C118.27 4.232 118.626 4.772 118.81 5.476H117.334C117.214 5.148 117.022 4.892 116.758 4.708C116.494 4.524 116.162 4.432 115.762 4.432C115.202 4.432 114.754 4.632 114.418 5.032C114.09 5.424 113.926 5.976 113.926 6.688C113.926 7.4 114.09 7.956 114.418 8.356C114.754 8.756 115.202 8.956 115.762 8.956C116.554 8.956 117.078 8.608 117.334 7.912H118.81C118.618 8.584 118.258 9.12 117.73 9.52C117.202 9.912 116.546 10.108 115.762 10.108C115.13 10.108 114.57 9.968 114.082 9.688C113.594 9.4 113.21 9 112.93 8.488C112.658 7.968 112.522 7.368 112.522 6.688ZM122.789 6.7L125.837 10H123.989L121.541 7.156V10H120.173V1.12H121.541V6.28L123.941 3.388H125.837L122.789 6.7Z" fill="#0CBB7D" />
                        <path d="M0 11.2H24.2723V11.8H0V11.2ZM24.2695 11.2H28.4695V11.8H24.2695V11.2ZM28.4648 11.2H36.1568V11.8H28.4648V11.2ZM36.1523 11.2H43.8443V11.8H36.1523V11.2ZM43.8398 11.2H53.3678V11.8H43.8398V11.2ZM53.3672 11.2H56.4872V11.8H53.3672V11.2ZM56.4844 11.2H68.9336V11.8H56.4844V11.2ZM68.9297 11.2H77.0657V11.8H68.9297V11.2ZM77.0625 11.2H80.2305V11.8H77.0625V11.2ZM80.2266 11.2H95.8153V11.8H80.2266V11.2ZM95.8125 11.2H103.949V11.8H95.8125V11.2ZM103.945 11.2H112.081V11.8H103.945V11.2ZM112.078 11.2H119.278V11.8H112.078V11.2ZM119.273 11.2H125.921V11.8H119.273V11.2Z" fill="#0CBB7D" />
                      </svg>
                      </p></td>
                      <td className="border-b px-4 py-2">
                        <button
                          className="bg-[#0CBB7D] text-white py-2 px-4 rounded-lg transition duration-300"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          Clone Order
                        </button>
                      </td>
                    </>
                  )}
                  {selectedStatus === "All" && (
                    <>
                      <td className="border-b px-2 py-2">
                        <div className="flex space-x-2">
                          <input type="checkbox" id="checkbox" onChange={() => handleSelectOrder(order.id)}
                            className="w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
                          <div>
                            <p className="underline underline-offset-2 ">{order.orderDetails}</p>
                            <p className="text-[#666666]">{order.Date} | {order.time}</p>
                            <p>{order.type}</p>
                            <p><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.392 6.44L3.304 12H2.248L0.152 6.44H1.128L2.776 11.064L4.432 6.44H5.392ZM6.61869 7.008C6.45335 7.008 6.31469 6.952 6.20269 6.84C6.09069 6.728 6.03469 6.58933 6.03469 6.424C6.03469 6.25867 6.09069 6.12 6.20269 6.008C6.31469 5.896 6.45335 5.84 6.61869 5.84C6.77869 5.84 6.91469 5.896 7.02669 6.008C7.13869 6.12 7.19469 6.25867 7.19469 6.424C7.19469 6.58933 7.13869 6.728 7.02669 6.84C6.91469 6.952 6.77869 7.008 6.61869 7.008ZM7.06669 7.592V12H6.15469V7.592H7.06669ZM12.3041 9.688C12.3041 9.85333 12.2934 10.0027 12.2721 10.136H8.90406C8.93073 10.488 9.0614 10.7707 9.29606 10.984C9.53073 11.1973 9.81873 11.304 10.1601 11.304C10.6507 11.304 10.9974 11.0987 11.2001 10.688H12.1841C12.0507 11.0933 11.8081 11.4267 11.4561 11.688C11.1094 11.944 10.6774 12.072 10.1601 12.072C9.73873 12.072 9.36006 11.9787 9.02406 11.792C8.6934 11.6 8.43206 11.3333 8.24006 10.992C8.0534 10.6453 7.96006 10.2453 7.96006 9.792C7.96006 9.33867 8.05073 8.94133 8.23206 8.6C8.41873 8.25333 8.6774 7.98667 9.00806 7.8C9.34406 7.61333 9.72806 7.52 10.1601 7.52C10.5761 7.52 10.9467 7.61067 11.2721 7.792C11.5974 7.97333 11.8507 8.22933 12.0321 8.56C12.2134 8.88533 12.3041 9.26133 12.3041 9.688ZM11.3521 9.4C11.3467 9.064 11.2267 8.79467 10.9921 8.592C10.7574 8.38933 10.4667 8.288 10.1201 8.288C9.8054 8.288 9.53606 8.38933 9.31206 8.592C9.08806 8.78933 8.95473 9.05867 8.91206 9.4H11.3521ZM19.1216 7.592L17.7536 12H16.7936L15.9056 8.744L15.0176 12H14.0576L12.6816 7.592H13.6096L14.5296 11.136L15.4656 7.592H16.4176L17.3136 11.12L18.2256 7.592H19.1216ZM22.7933 8.24C22.9479 8.03733 23.1586 7.86667 23.4253 7.728C23.6919 7.58933 23.9933 7.52 24.3293 7.52C24.7133 7.52 25.0626 7.616 25.3773 7.808C25.6973 7.99467 25.9479 8.25867 26.1293 8.6C26.3106 8.94133 26.4013 9.33333 26.4013 9.776C26.4013 10.2187 26.3106 10.616 26.1293 10.968C25.9479 11.3147 25.6973 11.5867 25.3773 11.784C25.0626 11.976 24.7133 12.072 24.3293 12.072C23.9933 12.072 23.6946 12.0053 23.4333 11.872C23.1719 11.7333 22.9586 11.5627 22.7933 11.36V14.096H21.8813V7.592H22.7933V8.24ZM25.4733 9.776C25.4733 9.472 25.4093 9.21067 25.2812 8.992C25.1586 8.768 24.9933 8.6 24.7853 8.488C24.5826 8.37067 24.3639 8.312 24.1293 8.312C23.8999 8.312 23.6813 8.37067 23.4733 8.488C23.2706 8.60533 23.1053 8.776 22.9773 9C22.8546 9.224 22.7933 9.488 22.7933 9.792C22.7933 10.096 22.8546 10.3627 22.9773 10.592C23.1053 10.816 23.2706 10.9867 23.4733 11.104C23.6813 11.2213 23.8999 11.28 24.1293 11.28C24.3639 11.28 24.5826 11.2213 24.7853 11.104C24.9933 10.9813 25.1586 10.8053 25.2812 10.576C25.4093 10.3467 25.4733 10.08 25.4733 9.776ZM28.2151 8.232C28.3485 8.008 28.5245 7.83467 28.7431 7.712C28.9671 7.584 29.2311 7.52 29.5351 7.52V8.464H29.3031C28.9458 8.464 28.6738 8.55467 28.4871 8.736C28.3058 8.91733 28.2151 9.232 28.2151 9.68V12H27.3031V7.592H28.2151V8.232ZM32.2854 12.072C31.8694 12.072 31.4934 11.9787 31.1574 11.792C30.8214 11.6 30.5574 11.3333 30.3654 10.992C30.1734 10.6453 30.0774 10.2453 30.0774 9.792C30.0774 9.344 30.1761 8.94667 30.3734 8.6C30.5708 8.25333 30.8401 7.98667 31.1814 7.8C31.5228 7.61333 31.9041 7.52 32.3254 7.52C32.7468 7.52 33.1281 7.61333 33.4694 7.8C33.8108 7.98667 34.0801 8.25333 34.2774 8.6C34.4748 8.94667 34.5734 9.344 34.5734 9.792C34.5734 10.24 34.4721 10.6373 34.2694 10.984C34.0668 11.3307 33.7894 11.6 33.4374 11.792C33.0908 11.9787 32.7068 12.072 32.2854 12.072ZM32.2854 11.28C32.5201 11.28 32.7388 11.224 32.9414 11.112C33.1494 11 33.3174 10.832 33.4454 10.608C33.5734 10.384 33.6374 10.112 33.6374 9.792C33.6374 9.472 33.5761 9.20267 33.4534 8.984C33.3308 8.76 33.1681 8.592 32.9654 8.48C32.7628 8.368 32.5441 8.312 32.3094 8.312C32.0748 8.312 31.8561 8.368 31.6534 8.48C31.4561 8.592 31.2988 8.76 31.1814 8.984C31.0641 9.20267 31.0054 9.472 31.0054 9.792C31.0054 10.2667 31.1254 10.6347 31.3654 10.896C31.6108 11.152 31.9174 11.28 32.2854 11.28ZM35.171 9.776C35.171 9.33333 35.2617 8.94133 35.443 8.6C35.6297 8.25867 35.8803 7.99467 36.195 7.808C36.515 7.616 36.8697 7.52 37.259 7.52C37.547 7.52 37.8297 7.584 38.107 7.712C38.3897 7.83467 38.6137 8 38.779 8.208V6.08H39.699V12H38.779V11.336C38.6297 11.5493 38.4217 11.7253 38.155 11.864C37.8937 12.0027 37.5923 12.072 37.251 12.072C36.867 12.072 36.515 11.976 36.195 11.784C35.8803 11.5867 35.6297 11.3147 35.443 10.968C35.2617 10.616 35.171 10.2187 35.171 9.776ZM38.779 9.792C38.779 9.488 38.715 9.224 38.587 9C38.4643 8.776 38.3017 8.60533 38.099 8.488C37.8963 8.37067 37.6777 8.312 37.443 8.312C37.2083 8.312 36.9897 8.37067 36.787 8.488C36.5843 8.6 36.419 8.768 36.291 8.992C36.1683 9.21067 36.107 9.472 36.107 9.776C36.107 10.08 36.1683 10.3467 36.291 10.576C36.419 10.8053 36.5843 10.9813 36.787 11.104C36.995 11.2213 37.2137 11.28 37.443 11.28C37.6777 11.28 37.8963 11.2213 38.099 11.104C38.3017 10.9867 38.4643 10.816 38.587 10.592C38.715 10.3627 38.779 10.096 38.779 9.792ZM44.8889 7.592V12H43.9769V11.48C43.8329 11.6613 43.6435 11.8053 43.4089 11.912C43.1795 12.0133 42.9342 12.064 42.6729 12.064C42.3262 12.064 42.0142 11.992 41.7369 11.848C41.4649 11.704 41.2489 11.4907 41.0889 11.208C40.9342 10.9253 40.8569 10.584 40.8569 10.184V7.592H41.7609V10.048C41.7609 10.4427 41.8595 10.7467 42.0569 10.96C42.2542 11.168 42.5235 11.272 42.8649 11.272C43.2062 11.272 43.4755 11.168 43.6729 10.96C43.8755 10.7467 43.9769 10.4427 43.9769 10.048V7.592H44.8889ZM45.7882 9.792C45.7882 9.33867 45.8789 8.94133 46.0602 8.6C46.2469 8.25333 46.5029 7.98667 46.8282 7.8C47.1535 7.61333 47.5269 7.52 47.9482 7.52C48.4815 7.52 48.9215 7.648 49.2682 7.904C49.6202 8.15467 49.8575 8.51467 49.9802 8.984H48.9962C48.9162 8.76533 48.7882 8.59467 48.6122 8.472C48.4362 8.34933 48.2149 8.288 47.9482 8.288C47.5749 8.288 47.2762 8.42133 47.0522 8.688C46.8335 8.94933 46.7242 9.31733 46.7242 9.792C46.7242 10.2667 46.8335 10.6373 47.0522 10.904C47.2762 11.1707 47.5749 11.304 47.9482 11.304C48.4762 11.304 48.8255 11.072 48.9962 10.608H49.9802C49.8522 11.056 49.6122 11.4133 49.2602 11.68C48.9082 11.9413 48.4709 12.072 47.9482 12.072C47.5269 12.072 47.1535 11.9787 46.8282 11.792C46.5029 11.6 46.2469 11.3333 46.0602 10.992C45.8789 10.6453 45.7882 10.2453 45.7882 9.792ZM51.9531 8.336V10.776C51.9531 10.9413 51.9904 11.0613 52.0651 11.136C52.1451 11.2053 52.2784 11.24 52.4651 11.24H53.0251V12H52.3051C51.8944 12 51.5797 11.904 51.3611 11.712C51.1424 11.52 51.0331 11.208 51.0331 10.776V8.336H50.5131V7.592H51.0331V6.496H51.9531V7.592H53.0251V8.336H51.9531Z" fill="#0CBB7D" />
                              <path d="M0 12.8H7.66669V13.2H0V12.8ZM7.66406 12.8H21.2831V13.2H7.66406V12.8ZM21.2812 12.8H26.7052V13.2H21.2812V12.8ZM26.7031 12.8H29.7751V13.2H26.7031V12.8ZM29.7734 12.8H34.8774V13.2H29.7734V12.8ZM34.875 12.8H40.299V13.2H34.875V12.8ZM40.2969 12.8H50.2922V13.2H40.2969V12.8ZM50.2891 12.8H53.2651V13.2H50.2891V12.8Z" fill="#0CBB7D" />
                            </svg>
                            </p>
                          </div></div>
                      </td>
                      <td className="border-b px-4 py-2">{order.customerName}<p>{order.email}</p>
                        {order.contactNo}</td>
                      <td className="border-b px-2 py-2">{order.payment}<p><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></p></td>
                      <td className="border-b px-2 py-2">{order.rtoAddress}</td>
                      <td className="border-b px-2 py-2">{order.shippingDetails}<br /><p className=" text-[#098559] flex items-center space-x-2 hover:cursor-pointer" onClick={handleCopy}> <p className="text-[#1A1A1A]">AWS #</p>{order.pickId} <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <mask id="mask1" x="0" y="0" width="13" height="13">
                            <rect width="13" height="13" fill="#D9D9D9" />
                          </mask>
                        </defs>
                        <g mask="url(#mask0_1117_24188)">
                          <path d="M4.875 9.7526C4.57708 9.7526 4.32205 9.64653 4.1099 9.43437C3.89774 9.22222 3.79167 8.96719 3.79167 8.66927V2.16927C3.79167 1.87135 3.89774 1.61632 4.1099 1.40417C4.32205 1.19201 4.57708 1.08594 4.875 1.08594H9.75C10.0479 1.08594 10.303 1.19201 10.5151 1.40417C10.7273 1.61632 10.8333 1.87135 10.8333 2.16927V8.66927C10.8333 8.96719 10.7273 9.22222 10.5151 9.43437C10.303 9.64653 10.0479 9.7526 9.75 9.7526H4.875ZM4.875 8.66927H9.75V2.16927H4.875V8.66927ZM2.70833 11.9193C2.41042 11.9193 2.15538 11.8132 1.94323 11.601C1.73108 11.3889 1.625 11.1339 1.625 10.8359V3.2526H2.70833V10.8359H8.66667V11.9193H2.70833Z" fill="#0CBB7D" />
                        </g>
                      </svg>
                      </p></td>
                      <td className="border-b px-2 py-2"><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></td>
                      <td className="border-b px-2 py-2"><svg width="141" height="34" viewBox="0 0 141 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="141" height="34" rx="5" fill="#0CBB7D" />
                        <path d="M20.004 12.624C20.884 12.624 21.656 12.796 22.32 13.14C22.992 13.484 23.508 13.976 23.868 14.616C24.236 15.248 24.42 15.984 24.42 16.824C24.42 17.664 24.236 18.4 23.868 19.032C23.508 19.656 22.992 20.14 22.32 20.484C21.656 20.828 20.884 21 20.004 21H17.076V12.624H20.004ZM19.944 19.572C20.824 19.572 21.504 19.332 21.984 18.852C22.464 18.372 22.704 17.696 22.704 16.824C22.704 15.952 22.464 15.272 21.984 14.784C21.504 14.288 20.824 14.04 19.944 14.04H18.756V19.572H19.944ZM28.6296 21.108C27.9896 21.108 27.4136 20.968 26.9016 20.688C26.3896 20.4 25.9856 19.996 25.6896 19.476C25.4016 18.956 25.2576 18.356 25.2576 17.676C25.2576 16.996 25.4056 16.396 25.7016 15.876C26.0056 15.356 26.4176 14.956 26.9376 14.676C27.4576 14.388 28.0376 14.244 28.6776 14.244C29.3176 14.244 29.8976 14.388 30.4176 14.676C30.9376 14.956 31.3456 15.356 31.6416 15.876C31.9456 16.396 32.0976 16.996 32.0976 17.676C32.0976 18.356 31.9416 18.956 31.6296 19.476C31.3256 19.996 30.9096 20.4 30.3816 20.688C29.8616 20.968 29.2776 21.108 28.6296 21.108ZM28.6296 19.644C28.9336 19.644 29.2176 19.572 29.4816 19.428C29.7536 19.276 29.9696 19.052 30.1296 18.756C30.2896 18.46 30.3696 18.1 30.3696 17.676C30.3696 17.044 30.2016 16.56 29.8656 16.224C29.5376 15.88 29.1336 15.708 28.6536 15.708C28.1736 15.708 27.7696 15.88 27.4416 16.224C27.1216 16.56 26.9616 17.044 26.9616 17.676C26.9616 18.308 27.1176 18.796 27.4296 19.14C27.7496 19.476 28.1496 19.644 28.6296 19.644ZM42.546 14.352L40.602 21H38.79L37.578 16.356L36.366 21H34.542L32.586 14.352H34.29L35.466 19.416L36.738 14.352H38.514L39.762 19.404L40.938 14.352H42.546ZM47.139 14.256C47.931 14.256 48.571 14.508 49.059 15.012C49.547 15.508 49.791 16.204 49.791 17.1V21H48.111V17.328C48.111 16.8 47.979 16.396 47.715 16.116C47.451 15.828 47.091 15.684 46.635 15.684C46.171 15.684 45.803 15.828 45.531 16.116C45.267 16.396 45.135 16.8 45.135 17.328V21H43.455V14.352H45.135V15.18C45.359 14.892 45.643 14.668 45.987 14.508C46.339 14.34 46.723 14.256 47.139 14.256ZM53.0685 12.12V21H51.3885V12.12H53.0685ZM57.6804 21.108C57.0404 21.108 56.4644 20.968 55.9524 20.688C55.4404 20.4 55.0364 19.996 54.7404 19.476C54.4524 18.956 54.3084 18.356 54.3084 17.676C54.3084 16.996 54.4564 16.396 54.7524 15.876C55.0564 15.356 55.4684 14.956 55.9884 14.676C56.5084 14.388 57.0884 14.244 57.7284 14.244C58.3684 14.244 58.9484 14.388 59.4684 14.676C59.9884 14.956 60.3964 15.356 60.6924 15.876C60.9964 16.396 61.1484 16.996 61.1484 17.676C61.1484 18.356 60.9924 18.956 60.6804 19.476C60.3764 19.996 59.9604 20.4 59.4324 20.688C58.9124 20.968 58.3284 21.108 57.6804 21.108ZM57.6804 19.644C57.9844 19.644 58.2684 19.572 58.5324 19.428C58.8044 19.276 59.0204 19.052 59.1804 18.756C59.3404 18.46 59.4204 18.1 59.4204 17.676C59.4204 17.044 59.2524 16.56 58.9164 16.224C58.5884 15.88 58.1844 15.708 57.7044 15.708C57.2244 15.708 56.8204 15.88 56.4924 16.224C56.1724 16.56 56.0124 17.044 56.0124 17.676C56.0124 18.308 56.1684 18.796 56.4804 19.14C56.8004 19.476 57.2004 19.644 57.6804 19.644ZM61.9487 17.652C61.9487 16.98 62.0807 16.384 62.3447 15.864C62.6167 15.344 62.9807 14.944 63.4367 14.664C63.9007 14.384 64.4167 14.244 64.9847 14.244C65.4807 14.244 65.9127 14.344 66.2807 14.544C66.6567 14.744 66.9567 14.996 67.1807 15.3V14.352H68.8727V21H67.1807V20.028C66.9647 20.34 66.6647 20.6 66.2807 20.808C65.9047 21.008 65.4687 21.108 64.9727 21.108C64.4127 21.108 63.9007 20.964 63.4367 20.676C62.9807 20.388 62.6167 19.984 62.3447 19.464C62.0807 18.936 61.9487 18.332 61.9487 17.652ZM67.1807 17.676C67.1807 17.268 67.1007 16.92 66.9407 16.632C66.7807 16.336 66.5647 16.112 66.2927 15.96C66.0207 15.8 65.7287 15.72 65.4167 15.72C65.1047 15.72 64.8167 15.796 64.5527 15.948C64.2887 16.1 64.0727 16.324 63.9047 16.62C63.7447 16.908 63.6647 17.252 63.6647 17.652C63.6647 18.052 63.7447 18.404 63.9047 18.708C64.0727 19.004 64.2887 19.232 64.5527 19.392C64.8247 19.552 65.1127 19.632 65.4167 19.632C65.7287 19.632 66.0207 19.556 66.2927 19.404C66.5647 19.244 66.7807 19.02 66.9407 18.732C67.1007 18.436 67.1807 18.084 67.1807 17.676ZM70.0815 17.652C70.0815 16.98 70.2135 16.384 70.4775 15.864C70.7495 15.344 71.1175 14.944 71.5815 14.664C72.0455 14.384 72.5615 14.244 73.1295 14.244C73.5615 14.244 73.9735 14.34 74.3655 14.532C74.7575 14.716 75.0695 14.964 75.3015 15.276V12.12H77.0055V21H75.3015V20.016C75.0935 20.344 74.8015 20.608 74.4255 20.808C74.0495 21.008 73.6135 21.108 73.1175 21.108C72.5575 21.108 72.0455 20.964 71.5815 20.676C71.1175 20.388 70.7495 19.984 70.4775 19.464C70.2135 18.936 70.0815 18.332 70.0815 17.652ZM75.3135 17.676C75.3135 17.268 75.2335 16.92 75.0735 16.632C74.9135 16.336 74.6975 16.112 74.4255 15.96C74.1535 15.8 73.8615 15.72 73.5495 15.72C73.2375 15.72 72.9495 15.796 72.6855 15.948C72.4215 16.1 72.2055 16.324 72.0375 16.62C71.8775 16.908 71.7975 17.252 71.7975 17.652C71.7975 18.052 71.8775 18.404 72.0375 18.708C72.2055 19.004 72.4215 19.232 72.6855 19.392C72.9575 19.552 73.2455 19.632 73.5495 19.632C73.8615 19.632 74.1535 19.556 74.4255 19.404C74.6975 19.244 74.9135 19.02 75.0735 18.732C75.2335 18.436 75.3135 18.084 75.3135 17.676ZM82.3577 13.56C82.0617 13.56 81.8137 13.468 81.6137 13.284C81.4217 13.092 81.3257 12.856 81.3257 12.576C81.3257 12.296 81.4217 12.064 81.6137 11.88C81.8137 11.688 82.0617 11.592 82.3577 11.592C82.6537 11.592 82.8977 11.688 83.0897 11.88C83.2897 12.064 83.3897 12.296 83.3897 12.576C83.3897 12.856 83.2897 13.092 83.0897 13.284C82.8977 13.468 82.6537 13.56 82.3577 13.56ZM83.1857 14.352V21H81.5057V14.352H83.1857ZM88.5296 14.256C89.3216 14.256 89.9616 14.508 90.4496 15.012C90.9376 15.508 91.1816 16.204 91.1816 17.1V21H89.5016V17.328C89.5016 16.8 89.3696 16.396 89.1056 16.116C88.8416 15.828 88.4816 15.684 88.0256 15.684C87.5616 15.684 87.1936 15.828 86.9216 16.116C86.6576 16.396 86.5256 16.8 86.5256 17.328V21H84.8456V14.352H86.5256V15.18C86.7496 14.892 87.0336 14.668 87.3776 14.508C87.7296 14.34 88.1136 14.256 88.5296 14.256ZM95.5512 19.452L97.2312 14.352H99.0192L96.5592 21H94.5192L92.0712 14.352H93.8712L95.5512 19.452ZM102.915 21.108C102.275 21.108 101.699 20.968 101.187 20.688C100.675 20.4 100.271 19.996 99.9748 19.476C99.6868 18.956 99.5428 18.356 99.5428 17.676C99.5428 16.996 99.6908 16.396 99.9868 15.876C100.291 15.356 100.703 14.956 101.223 14.676C101.743 14.388 102.323 14.244 102.963 14.244C103.603 14.244 104.183 14.388 104.703 14.676C105.223 14.956 105.631 15.356 105.927 15.876C106.231 16.396 106.383 16.996 106.383 17.676C106.383 18.356 106.227 18.956 105.915 19.476C105.611 19.996 105.195 20.4 104.667 20.688C104.147 20.968 103.563 21.108 102.915 21.108ZM102.915 19.644C103.219 19.644 103.503 19.572 103.767 19.428C104.039 19.276 104.255 19.052 104.415 18.756C104.575 18.46 104.655 18.1 104.655 17.676C104.655 17.044 104.487 16.56 104.151 16.224C103.823 15.88 103.419 15.708 102.939 15.708C102.459 15.708 102.055 15.88 101.727 16.224C101.407 16.56 101.247 17.044 101.247 17.676C101.247 18.308 101.403 18.796 101.715 19.14C102.035 19.476 102.435 19.644 102.915 19.644ZM108.467 13.56C108.171 13.56 107.923 13.468 107.723 13.284C107.531 13.092 107.435 12.856 107.435 12.576C107.435 12.296 107.531 12.064 107.723 11.88C107.923 11.688 108.171 11.592 108.467 11.592C108.763 11.592 109.007 11.688 109.199 11.88C109.399 12.064 109.499 12.296 109.499 12.576C109.499 12.856 109.399 13.092 109.199 13.284C109.007 13.468 108.763 13.56 108.467 13.56ZM109.295 14.352V21H107.615V14.352H109.295ZM110.523 17.676C110.523 16.988 110.663 16.388 110.943 15.876C111.223 15.356 111.611 14.956 112.107 14.676C112.603 14.388 113.171 14.244 113.811 14.244C114.635 14.244 115.315 14.452 115.851 14.868C116.395 15.276 116.759 15.852 116.943 16.596H115.131C115.035 16.308 114.871 16.084 114.639 15.924C114.415 15.756 114.135 15.672 113.799 15.672C113.319 15.672 112.939 15.848 112.659 16.2C112.379 16.544 112.239 17.036 112.239 17.676C112.239 18.308 112.379 18.8 112.659 19.152C112.939 19.496 113.319 19.668 113.799 19.668C114.479 19.668 114.923 19.364 115.131 18.756H116.943C116.759 19.476 116.395 20.048 115.851 20.472C115.307 20.896 114.627 21.108 113.811 21.108C113.171 21.108 112.603 20.968 112.107 20.688C111.611 20.4 111.223 20 110.943 19.488C110.663 18.968 110.523 18.364 110.523 17.676ZM124.354 17.532C124.354 17.772 124.338 17.988 124.306 18.18H119.446C119.486 18.66 119.654 19.036 119.95 19.308C120.246 19.58 120.61 19.716 121.042 19.716C121.666 19.716 122.11 19.448 122.374 18.912H124.186C123.994 19.552 123.626 20.08 123.082 20.496C122.538 20.904 121.87 21.108 121.078 21.108C120.438 21.108 119.862 20.968 119.35 20.688C118.846 20.4 118.45 19.996 118.162 19.476C117.882 18.956 117.742 18.356 117.742 17.676C117.742 16.988 117.882 16.384 118.162 15.864C118.442 15.344 118.834 14.944 119.338 14.664C119.842 14.384 120.422 14.244 121.078 14.244C121.71 14.244 122.274 14.38 122.77 14.652C123.274 14.924 123.662 15.312 123.934 15.816C124.214 16.312 124.354 16.884 124.354 17.532ZM122.614 17.052C122.606 16.62 122.45 16.276 122.146 16.02C121.842 15.756 121.47 15.624 121.03 15.624C120.614 15.624 120.262 15.752 119.974 16.008C119.694 16.256 119.522 16.604 119.458 17.052H122.614Z" fill="#FAFEFC" />
                      </svg>
                      </td>
                    </>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default OrderList;