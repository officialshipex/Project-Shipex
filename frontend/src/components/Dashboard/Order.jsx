import React, { useState, useEffect } from "react";
import 'typeface-poppins';

// import NavBar from "../Common/NavBar";
// import Sidebar from "../Common/Sidebar";
import { FaChevronDown, FaSearch } from "react-icons/fa";
// Sample order data
const orders = [
  {
    id: 1,
    customerName: "Alice Green",
    Date: "12-jan-2024",
    type: "CUSTOM",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    product: "T-shirt",
    sku: "SKU123",
    qty: 2,
    deadWeight: "0.5 kg",
    weight: "10.00 x 10.00 x 12.00 (cm)",
    volumetricWeight: "0.7 kg ",
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
    id:2,
    Date: "12-jan-2024",
    type: "CUSTOM",
    customerName: "David Blue",
    email: "david@example.com",
    contactNo: "987-654-3210",
    product: "Jeans",
    sku: "SKU124",
    qty: 1,
    deadWeight: "1 kg",
    weight: "1.00 x 1.00 x 12.00 (cm)",
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
  {
    id: 3,
    customerName: "Alice Green",
    Date: "12-jan-2024",
    type: "CUSTOM",
    email: "alice@example.com",
    contactNo: "123-456-7890",
    product: "T-shirt",
    sku: "SKU123",
    qty: 2,
    deadWeight: "0.5 kg",
    weight: "10.00 x 10.00 x 12.00 (cm)",
    volumetricWeight: "0.7 kg ",
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
        <div className="container mx-auto mt-16 bg-white shadow-md rounded-lg p-2">
          <div className="flex justify-between items-center p-4">
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
          <div className="flex items-center mb-4 font-style:Poppins border-b-4">
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
            <div className="absolute flex flex-col space-y-4 top-32 w-36 right-52 px-4 py-2 bg-[#F9F9F9] 'text-gray-500 transition-opacity-100">
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
          <table className="min-w-full bg-white border text-gray-500 border-gray-300 rounded-lg text-center">
            <thead>
              <tr className="bg-gray-100 ">
                {HEADERS[selectedStatus] &&
                  HEADERS[selectedStatus].map((header, index) => (
                    <th
                      key={index}
                      className="border-b px-2 py-2 text-[#4e4e4e] font-style:Poppins"
                    >
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="px-2 py-3">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100 px-2 py-2 text-[#1A1A1A]">
                  {selectedStatus === "New Orders" && (
                    <>
                      <td className="border-b px-2 py-3"><div className="flex flex-auto "><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.416667" y="0.416667" width="19.1667" height="19.1667" rx="2.91667" stroke="#0CBB7D" stroke-width="0.833333" />
                      </svg><div>
                          <p>{order.id}</p>
                          <p className="text-[#666666]">{order.Date}</p>
                          <p>{order.type}</p>
                        </div></div></td>
                      <td className="border-b px-4 py-3">
                        {order.customerName}
                        <br />
                        <p className="text-[#666666]">{order.email}</p>
                        {order.contactNo}
                        <br />
                        <div className="hover:cursor-pointer flex justify-center items-center">
                          <svg width="83" height="18" viewBox="0 0 83 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.088 4.66L4.956 13H3.372L0.228 4.66H1.692L4.164 11.596L6.648 4.66H8.088ZM9.92803 5.512C9.68003 5.512 9.47203 5.428 9.30403 5.26C9.13603 5.092 9.05203 4.884 9.05203 4.636C9.05203 4.388 9.13603 4.18 9.30403 4.012C9.47203 3.844 9.68003 3.76 9.92803 3.76C10.168 3.76 10.372 3.844 10.54 4.012C10.708 4.18 10.792 4.388 10.792 4.636C10.792 4.884 10.708 5.092 10.54 5.26C10.372 5.428 10.168 5.512 9.92803 5.512ZM10.6 6.388V13H9.23203V6.388H10.6ZM18.4561 9.532C18.4561 9.78 18.4401 10.004 18.4081 10.204H13.3561C13.3961 10.732 13.5921 11.156 13.9441 11.476C14.2961 11.796 14.7281 11.956 15.2401 11.956C15.9761 11.956 16.4961 11.648 16.8001 11.032H18.2761C18.0761 11.64 17.7121 12.14 17.1841 12.532C16.6641 12.916 16.0161 13.108 15.2401 13.108C14.6081 13.108 14.0401 12.968 13.5361 12.688C13.0401 12.4 12.6481 12 12.3601 11.488C12.0801 10.968 11.9401 10.368 11.9401 9.688C11.9401 9.008 12.0761 8.412 12.3481 7.9C12.6281 7.38 13.0161 6.98 13.5121 6.7C14.0161 6.42 14.5921 6.28 15.2401 6.28C15.8641 6.28 16.4201 6.416 16.9081 6.688C17.3961 6.96 17.7761 7.344 18.0481 7.84C18.3201 8.328 18.4561 8.892 18.4561 9.532ZM17.0281 9.1C17.0201 8.596 16.8401 8.192 16.4881 7.888C16.1361 7.584 15.7001 7.432 15.1801 7.432C14.7081 7.432 14.3041 7.584 13.9681 7.888C13.6321 8.184 13.4321 8.588 13.3681 9.1H17.0281ZM28.6823 6.388L26.6303 13H25.1903L23.8583 8.116L22.5263 13H21.0863L19.0223 6.388H20.4143L21.7943 11.704L23.1983 6.388H24.6263L25.9703 11.68L27.3383 6.388H28.6823ZM37.1539 13L35.2339 9.664H34.1899V13H32.8219V4.66H35.7019C36.3419 4.66 36.8819 4.772 37.3219 4.996C37.7699 5.22 38.1019 5.52 38.3179 5.896C38.5419 6.272 38.6539 6.692 38.6539 7.156C38.6539 7.7 38.4939 8.196 38.1739 8.644C37.8619 9.084 37.3779 9.384 36.7219 9.544L38.7859 13H37.1539ZM34.1899 8.572H35.7019C36.2139 8.572 36.5979 8.444 36.8539 8.188C37.1179 7.932 37.2499 7.588 37.2499 7.156C37.2499 6.724 37.1219 6.388 36.8659 6.148C36.6099 5.9 36.2219 5.776 35.7019 5.776H34.1899V8.572ZM45.7919 4.66V5.776H43.5719V13H42.2039V5.776H39.9719V4.66H45.7919ZM50.9813 13.084C50.2053 13.084 49.4893 12.904 48.8333 12.544C48.1853 12.176 47.6693 11.668 47.2853 11.02C46.9093 10.364 46.7213 9.628 46.7213 8.812C46.7213 7.996 46.9093 7.264 47.2853 6.616C47.6693 5.968 48.1853 5.464 48.8333 5.104C49.4893 4.736 50.2053 4.552 50.9813 4.552C51.7653 4.552 52.4813 4.736 53.1293 5.104C53.7853 5.464 54.3013 5.968 54.6773 6.616C55.0533 7.264 55.2413 7.996 55.2413 8.812C55.2413 9.628 55.0533 10.364 54.6773 11.02C54.3013 11.668 53.7853 12.176 53.1293 12.544C52.4813 12.904 51.7653 13.084 50.9813 13.084ZM50.9813 11.896C51.5333 11.896 52.0253 11.772 52.4573 11.524C52.8893 11.268 53.2253 10.908 53.4653 10.444C53.7133 9.972 53.8373 9.428 53.8373 8.812C53.8373 8.196 53.7133 7.656 53.4653 7.192C53.2253 6.728 52.8893 6.372 52.4573 6.124C52.0253 5.876 51.5333 5.752 50.9813 5.752C50.4293 5.752 49.9373 5.876 49.5053 6.124C49.0733 6.372 48.7333 6.728 48.4853 7.192C48.2453 7.656 48.1253 8.196 48.1253 8.812C48.1253 9.428 48.2453 9.972 48.4853 10.444C48.7333 10.908 49.0733 11.268 49.5053 11.524C49.9373 11.772 50.4293 11.896 50.9813 11.896ZM64.0367 13L62.1167 9.664H61.0727V13H59.7047V4.66H62.5847C63.2247 4.66 63.7647 4.772 64.2047 4.996C64.6527 5.22 64.9847 5.52 65.2007 5.896C65.4247 6.272 65.5367 6.692 65.5367 7.156C65.5367 7.7 65.3767 8.196 65.0567 8.644C64.7447 9.084 64.2607 9.384 63.6047 9.544L65.6687 13H64.0367ZM61.0727 8.572H62.5847C63.0967 8.572 63.4807 8.444 63.7367 8.188C64.0007 7.932 64.1327 7.588 64.1327 7.156C64.1327 6.724 64.0047 6.388 63.7487 6.148C63.4927 5.9 63.1047 5.776 62.5847 5.776H61.0727V8.572ZM67.9827 5.512C67.7347 5.512 67.5267 5.428 67.3587 5.26C67.1907 5.092 67.1067 4.884 67.1067 4.636C67.1067 4.388 67.1907 4.18 67.3587 4.012C67.5267 3.844 67.7347 3.76 67.9827 3.76C68.2227 3.76 68.4267 3.844 68.5947 4.012C68.7627 4.18 68.8467 4.388 68.8467 4.636C68.8467 4.884 68.7627 5.092 68.5947 5.26C68.4267 5.428 68.2227 5.512 67.9827 5.512ZM68.6547 6.388V13H67.2867V6.388H68.6547ZM72.8508 13.108C72.3308 13.108 71.8628 13.016 71.4468 12.832C71.0388 12.64 70.7148 12.384 70.4748 12.064C70.2348 11.736 70.1068 11.372 70.0908 10.972H71.5068C71.5308 11.252 71.6628 11.488 71.9028 11.68C72.1508 11.864 72.4588 11.956 72.8268 11.956C73.2108 11.956 73.5068 11.884 73.7148 11.74C73.9308 11.588 74.0388 11.396 74.0388 11.164C74.0388 10.916 73.9188 10.732 73.6788 10.612C73.4468 10.492 73.0748 10.36 72.5628 10.216C72.0668 10.08 71.6628 9.948 71.3508 9.82C71.0388 9.692 70.7668 9.496 70.5348 9.232C70.3108 8.968 70.1988 8.62 70.1988 8.188C70.1988 7.836 70.3028 7.516 70.5108 7.228C70.7188 6.932 71.0148 6.7 71.3988 6.532C71.7908 6.364 72.2388 6.28 72.7428 6.28C73.4948 6.28 74.0988 6.472 74.5548 6.856C75.0188 7.232 75.2668 7.748 75.2988 8.404H73.9308C73.9068 8.108 73.7868 7.872 73.5708 7.696C73.3548 7.52 73.0628 7.432 72.6948 7.432C72.3348 7.432 72.0588 7.5 71.8668 7.636C71.6748 7.772 71.5788 7.952 71.5788 8.176C71.5788 8.352 71.6428 8.5 71.7708 8.62C71.8988 8.74 72.0548 8.836 72.2388 8.908C72.4228 8.972 72.6948 9.056 73.0548 9.16C73.5348 9.288 73.9268 9.42 74.2308 9.556C74.5428 9.684 74.8108 9.876 75.0348 10.132C75.2588 10.388 75.3748 10.728 75.3828 11.152C75.3828 11.528 75.2788 11.864 75.0708 12.16C74.8628 12.456 74.5668 12.688 74.1828 12.856C73.8068 13.024 73.3628 13.108 72.8508 13.108ZM79.4769 9.7L82.5249 13H80.6769L78.2289 10.156V13H76.8609V4.12H78.2289V9.28L80.6289 6.388H82.5249L79.4769 9.7Z" fill="#0CBB7D" />
                            <path d="M0 14.2H82.6089V14.8H0V14.2Z" fill="#0CBB7D" />
                          </svg>
                        </div>
                      </td>
                      <td className="border-b px-2 py-3">
                        {order.product}
                        <br />
                        <p className="text-[#666666]">{order.sku}</p>
                        {order.qty}
                      </td>
                      <td className="border-b px-2 py-3">
                        {order.deadWeight}
                        <br />
                        <p className="text-[#666666]">{order.weight}</p>               
                        {order.volumetricWeight}
                      </td>
                      <td className="border-b px-2 py-3">{order.price}<div><button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.paymentStatus}</button></div></td>
                      <td className="border-b px-2 py-3">{order.pickupAddress}</td>
                      <td className="border-b px-2 py-3"> <button className="bg-[#EBF7E8] text-[#098559] rounded-lg px-2 py-2">{order.status}</button> </td>
                      <td className="border-b px-2 py-3 flex flex-col items-center">
                        <div className="flex flex-col items-center space-y-1 px-2 py-3">
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
    </div >
  );
};

export default OrderList;