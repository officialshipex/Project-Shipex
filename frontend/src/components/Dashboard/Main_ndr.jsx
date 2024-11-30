import React, { useState } from "react";

const returnRequestedData = [
  {
    id: 1,
    date: "02 July 2024 | 1:23",
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
    date: "02 July 2024 | 123",
    attempt: "3rd Attempt",
    lastNDRReason: "Customer Refused",
    buyerName: "Riya Sharma",
    email: "RS@gmail.com",
    productID: "485862329",
    purchaseDate: "15 Jul 2024 | 07:16 PM",
    phone: "5639742436",
    fulfillment: "--------",
    ivrStatus: "Pending",
    lastAction: "Pending",
    firstNDR: "Pending",
    aging: "--------",
    status: "Action Taken",
  },
  {
    id: 3,
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
    status: "Delivered",
  },
  {
    id: 4,
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
    status: "RTO",
  },
];

const NDR = () => {
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedOrders = {};
    returnRequestedData.forEach((order) => {
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

  const filteredOrders =
    selectedStatus === "All"
      ? returnRequestedData
      : returnRequestedData.filter((order) => order.status === selectedStatus);

  const getHeaders = () => {
    const baseHeaders = [
      "Tracking Details",
      "Customer Details",
      "Item Details",
      "Fulfilled by",
      "Last Action",
      "First NDR",
      "OFD Aging",
      "Actions",
    ];

    if (selectedStatus === "All" || selectedStatus === "Action Required") {
      baseHeaders.splice(4, 0, "IVR Status"); // Add "IVR Status" at the appropriate position.
    }

    return baseHeaders;
  };

  return (
    <div className="container mx-auto mt-0 bg-[#FAFAFA] rounded-lg p-2">
      <div className="flex justify-between items-center mb-4 p-4">
        <h2 className="text-2xl font-bold">NDR Orders</h2>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200">
            Pick the dates
          </button>
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
        {["Action Required", "Action Taken", "Delivered", "RTO", "All"].map(
          (status, index) => (
            <button
              key={index}
              className={`py-2 px-4 text-sm transition duration-300 ${selectedStatus === status
                  ? "border-b-2 border-green-500 font-semibold text-black"
                  : "text-gray-500"
                }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-[#F9F9F9] shadow-md mb-4">
          <div className="border-b p-4 flex font-bold text-left bg-[#F9F9F9]">
            <input type="checkbox" onChange={handleSelectAll} className="mr-2 w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none" />
            {getHeaders().map((header, index) => (
              <div key={index} className="flex-1 text-center">
                {header}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border-b p-4 flex items-start text-left bg-[#F9F9F9]"
              >
                <input
                  type="checkbox"
                  checked={selectedOrders[order.id] || false}
                  onChange={() => handleSelectOrder(order.id)}
                  className="mr-2 w-6 h-5 accent-[#0CBB7D] border-4 border-green-500  focus:outline-none"
                />

                {/* Tracking Details */}
                <div className="flex-1 text-center">
                  <p>{order.date}</p>
                  <p className="ml-[-45px]">{order.attempt}</p>

                  <p className="text-sm text-[#666666] bg-[#F2F2F2] inline-block px-2 py-1 rounded-md">
                    <span className="text-[#222222]">Last NDR Reason:</span>{" "}
                    {order.lastNDRReason}
                  </p>
                </div>

                {/* Customer Details */}
                <div className="flex-1 text-center">
                  <p className="ml-0">{order.buyerName}</p>
                  <p className="ml-4">{order.email}</p>
                  <p className="ml-0">{order.phone}</p>

                </div>

                {/* Item Details */}
                <div className="flex-1 text-left">
                  <p className="ml-12 underline">{order.productID}</p>
                  <p className="ml-12 whitespace-nowrap">{order.purchaseDate}</p>
                  <p className="ml-12">{order.attempt === "3rd Attempt" ? "CUSTOM" : "--------"}</p>
                  <p
                    className={`ml-12 text-[14px] font-normal ${order.attempt === "4th Attempt" ? "" : "text-[#0CBB7D] underline"
                      }`}
                  >
                    {order.attempt === "4th Attempt" ? "CUSTOM" : "View Product"}
                  </p>
                </div>



                {/* Fulfilled By */}
                <div className="flex-1 text-center">
                  <p>
                    {selectedStatus === "Action Required" || selectedStatus === "All"
                      ? "--------"
                      : order.fulfillment}
                  </p>
                </div>



                {/* IVR Status */}
                {(selectedStatus === "Action Required" ||
                  selectedStatus === "All") && (
                    <div className="flex-1 text-center">
                      <p>--------</p>
                    </div>
                  )}

                {/* Last Action */}
                <div className="flex-1 text-center">
                  <p className="text-sm font-normal">Shipex</p>
                  <p className="bg-[#F2F2F2] text-[#FFB800] inline-block px-2 rounded-md">
                    {order.firstNDR}
                  </p>
                  <p className="text-sm font-normal">Remarks: None</p>
                </div>


                {/* First NDR */}
                <div className="flex-1 text-center">
                  <p className="text-sm font-normal">Shipex</p>
                  <p className="bg-[#F2F2F2] text-[#FFB800] inline-block px-2 rounded-md">
                    {order.firstNDR}
                  </p>
                  <p className="text-sm font-normal">Remarks: None</p>
                </div>

                {/* OFD Aging */}
                <div className=" text-center" style={{ marginLeft: '30px' }}>
                  <p>{order.aging}</p>
                </div>


                {/* Actions */}
                <div className="flex-1 text-center text-green-500 cursor-pointer mt-3">
                  View History
                  <div className="border-b-2 border-[#0CBB7D] mt-0.9 mx-auto w-1/2"></div> {/* Further reduced margin */}
                </div>


              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No orders available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NDR;