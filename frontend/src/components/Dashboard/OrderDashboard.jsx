

// RTO Dashboard Component
const RtoDashboard = () => {
  const rtoOrders = [
    { label: "RTO initialised", count: 5 },
    { label: "RTO in transit", count: 6 },
    { label: "RTO Delivered", count: 4 },
  ];

  return (
    <div className="rto-dashboard bg-gray-100 p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-bold mb-2">RTO Status</h6>
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div key={period} className="time-filter-item cursor-pointer border border-gray-300 rounded px-2 py-1 transition-colors duration-300 hover:bg-green-500 hover:text-white">
            {period}
          </div>
        ))}
      </div>
      <div className="orders-wrapper">
        <div className="flex gap-32"> {/* Increased the gap to 32 */}

          {rtoOrders.map((order, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-white border-2 border-black rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-50">
                <div className="font-bold text-sm">{order.count}</div>
              </div>
              <div className="text-xs text-center">{order.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// NDR Dashboard Component
const NdrDashboard = () => {
  const ndrOrders = [
    { label: "Action Required", count: 3 },
    { label: "Action Taken", count: 2 },
    { label: "Delivered", count: 1 },
    { label: "RTO", count: 2 },
    { label: "All", count: 1 },
  ];

  return (
    <div className="ndr-dashboard bg-gray-100 p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-bold mb-2">NDR Status</h6>
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div key={period} className="time-filter-item cursor-pointer border border-gray-300 rounded px-2 py-1 transition-colors duration-300 hover:bg-green-500 hover:text-white">
            {period}
          </div>
        ))}
      </div>
      <div className="orders-wrapper">
        <div className="flex gap-9">
          {ndrOrders.map((order, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-white border-2 border-black rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-50">
                <div className="font-bold text-sm">{order.count}</div>
              </div>
              <div className="text-xs text-center">{order.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Delivered Performance Component
const DeliveredPerformance = () => {
  return (
    <div className="delivered-performance bg-gray-100 p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-bold mb-2">Delivered Performance</h6>
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div key={period} className="time-filter-item cursor-pointer border border-gray-300 rounded px-2 py-1 transition-colors duration-300 hover:bg-green-500 hover:text-white">
            {period}
          </div>
        ))}
      </div>
    </div>
  );
};

// Weight Dispute Component
const WeightDispute = () => {
  return (
    <div className="weight-dispute bg-gray-100 p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-bold mb-2">Weight Dispute</h6>
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div key={period} className="time-filter-item cursor-pointer border border-gray-300 rounded px-2 py-1 transition-colors duration-300 hover:bg-green-500 hover:text-white">
            {period}
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Dashboard Component
const OrderDashboard = () => {
  const orders = [
    { label: "New Orders", count: 5 },
    { label: "Ready to Ship", count: 6 },
    { label: "Pickups", count: 4 },
    { label: "In Transit", count: 9 },
    { label: "Delivered Orders Today", count: 8 },
    { label: "Delivered", count: 8 },
    { label: "Lost/Damaged", count: 0 },
    { label: "Cancelled", count: 0 },
  ];

  return (
    <div className="flex flex-col h-full order-dashboard">
      <div className="flex flex-1">
        <div className="dashboard-content flex flex-col p-9 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h6 className="text-2xl font-bold">Dashboard</h6>
            <div className="flex space-x-4"> {/* Form aligned to the top right */}
              <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Pick the dates" />
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_2662_60602" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2662_60602)">
                      <path
                        d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                        fill="#4A4A4A"
                      />
                    </g>
                  </svg>
                </div>
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Track ID"
              />
              <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Track</button>
            </div>
          </div>

          <h6 className="text-lg font-bold mb-2">Orders</h6>
          <div className="orders-wrapper bg-gray-100 p-5 rounded-lg shadow-md flex-grow">
            <div className="flex gap-2 mb-4">
              {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
                <div key={period} className="time-filter-item cursor-pointer border border-gray-300 rounded px-2 py-1 transition-colors duration-300 hover:bg-green-500 hover:text-white">
                  {period}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-around gap-8"> {/* Use justify-around for even distribution */}
              {orders.map((order, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-white border-2 border-black rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-100">
                    <div className="font-bold text-sm">{order.count}</div>
                  </div>
                  <div className="text-xs text-center">{order.label}</div>
                </div>
              ))}
            </div>


            <div className="flex justify-between mt-5">
              <div className="flex-1">
                <RtoDashboard />
              </div>
              <div className="flex-1">
                <NdrDashboard />
              </div>
            </div>
            <div className="flex justify-between mt-5">
              <div className="flex-1">
                <DeliveredPerformance />
              </div>
              <div className="flex-1">
                <WeightDispute />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;


export { RtoDashboard, NdrDashboard, DeliveredPerformance, WeightDispute, OrderDashboard };
