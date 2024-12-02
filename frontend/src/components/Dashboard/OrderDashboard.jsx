// RTO Dashboard Component
const RtoDashboard = () => {
  const rtoOrders = [
    { label: "RTO initialised", count: 5 },
    { label: "RTO in transit", count: 6 },
    { label: "RTO Delivered", count: 4 },
  ];

  return (
    <div className="rto-dashboard bg-white p-5 rounded-lg shadow-md flex-1">
      <h6 className="text-lg font-medium mb-2">RTO Status</h6> {/* Changed to font-medium */}
      {/* Weekdays in RTO Dashboard */}
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div
            key={period}
            className="time-filter-item cursor-pointer rounded px-2 py-1 text-gray-500 transition-colors duration-300 hover:bg-green-500 hover:text-white"
          >
            {period}
          </div>
        ))}
      </div>
      <div className="orders-wrapper bg-white">
        <div className="flex gap-32">
          {rtoOrders.map((order, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-50">
                <div className="font-bold text-xl">{order.count}</div>
              </div>
              <div className="text-xs text-center text-gray-500">{order.label}</div>
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
    <div className="ndr-dashboard bg-white p-5 rounded-lg shadow-md flex-1">
      <h6 className="text-lg font-medium mb-2">NDR Status</h6> {/* Changed to font-medium */}
      {/* Weekdays in NDR Dashboard */}
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div
            key={period}
            className="time-filter-item cursor-pointer rounded px-2 py-1 text-gray-500 transition-colors duration-300 hover:bg-green-500 hover:text-white"
          >
            {period}
          </div>
        ))}
      </div>
      <div className="orders-wrapper bg-white">
        <div className="flex gap-9">
          {ndrOrders.map((order, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-50">
                <div className="font-bold text-xl">{order.count}</div>
              </div>
              <div className="text-xs text-center text-gray-500">{order.label}</div>
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
    <div className="delivered-performance bg-white p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-medium mb-2">Delivered Performance</h6> {/* Changed to font-medium */}
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div
            key={period}
            className="time-filter-item cursor-pointer rounded px-2 py-1 text-gray-500 transition-colors duration-300 hover:bg-green-500 hover:text-white"
          >
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
    <div className="weight-dispute bg-white p-5 rounded-lg shadow-md">
      <h6 className="text-lg font-medium mb-2">Weight Dispute</h6> {/* Changed to font-medium */}
      <div className="flex gap-2 mb-4">
        {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
          <div
            key={period}
            className="time-filter-item cursor-pointer rounded px-2 py-1 text-gray-500 transition-colors duration-300 hover:bg-green-500 hover:text-white"
          >
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
    <div className="flex flex-col h-screen order-dashboard">
      <div className="flex flex-1">
        <div className="dashboard-content flex flex-col p-9 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h6 className="text-2xl font-medium">Dashboard</h6> {/* Changed to font-medium */}
            <div className="flex space-x-4">
              {/* Updated search bars with bg-gray-200 */}
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pick the Dates"
              />
              <input
                type="text"
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
              />
              {/* Search bar (as text input now) */}
              <input
                type="text"
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by track ID"
              />
              <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Track
              </button>
            </div>
          </div>

          <h6 className="text-lg font-medium mb-2 ml-4">Orders</h6> {/* Moved the heading to the right */}

          <div className="bg-white p-5 rounded-lg shadow-md mb-5">
            {/* Weekdays inside Orders container */}
            <div className="flex gap-2 mb-4">
              {["Today", "Yesterday", "Last Week", "Past Month", "Custom"].map((period) => (
                <div
                  key={period}
                  className="time-filter-item cursor-pointer rounded px-2 py-1 text-gray-500 transition-colors duration-300 hover:bg-green-500 hover:text-white"
                >
                  {period}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-around gap-8">
              {orders.map((order, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center w-20 h-20 transition-colors duration-300 hover:bg-gray-100">
                    <div className="font-bold text-xl">{order.count}</div>
                  </div>
                  <div className="text-xs text-center text-gray-500">{order.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="orders-wrapper bg-white p-5 rounded-lg shadow-md flex-grow">
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
