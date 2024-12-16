import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CourierPage = () => {
  const couriers = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/DTDC_logo.png",
      name: "DTDC Surface",
      rating: 3.3,
      pickup: "Tomorrow",
      delivery: "Aug 16th, 2024",
      weight: "0.5kg",
      charges: "₹ 90.00",
      minWeight: "0.5kg",
      rtoCharges: "₹ 64",
    },
    {
      logo: "/Ecom.jpg",
      name: "Ecom Express",
      rating: 2.1,
      pickup: "Tomorrow",
      delivery: "Aug 16th, 2024",
      weight: "0.5kg",
      charges: "₹ 90.00",
      minWeight: "0.5kg",
      rtoCharges: "₹ 64",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      <div className="w-full flex bg-white rounded-md shadow-md">

        {/* Order Details Section */}
        <div className="w-1/3 bg-gray-50 p-6 space-y-4 border-r border-gray-200 ml-auto text-right"> {/* Added text-right here */}
          <h2 className="text-lg font-semibold text-gray-800">Order details</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-500 text-sm">Pick Up from</p>
              <p className="text-base text-gray-800">127021, Haryana</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Deliver to</p>
              <p className="text-base text-gray-800">478374, Chhattisgarh</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Order Value</p>
              <p className="text-base text-gray-800">₹ 1100.00</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Payment Mode</p>
              <p className="text-base text-gray-800">COD</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm">Applicable weight (in kg)</p>
              <p className="text-base text-gray-800">0.5kg</p>
            </div>
          </div>

          {/* Buyers Insights */}
          <div className="space-y-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Buyers Insights</h3>
            <p className="font-medium text-gray-500 text-sm">Last Successful delivery to buyer:</p>
            <p className="text-base text-gray-800">On your store</p>
            <p className="text-sm text-gray-500">No Orders yet</p>
          </div>
        </div>

        {/* Courier Partner Selection Section */}
        <div className="w-2/3 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select courier partner</h2>

          {/* Column Headers */}
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-md border-b border-gray-300 font-medium text-xs text-gray-600">
            <p className="w-1/4">Courier Partner</p>
            <p className="w-1/6 text-center">Rating</p>
            <p className="w-1/6 text-center">Expected Pickup</p>
            <p className="w-1/6 text-center">Estimated Delivery</p>
            <p className="w-1/6 text-center">Chargeable Weight</p>
            <p className="w-1/6 text-center">Charges</p>
            <p className="w-1/6 text-center">Action</p>
          </div>

          {/* Courier Options */}
          <div className="grid gap-1 mt-2">
            {couriers.map((courier, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border rounded-md shadow-sm bg-gray-50"
              >
                {/* Logo and Name */}
                <div className="flex flex-col items-center space-y-1 w-1/4">
                  <img src={courier.logo} alt={`${courier.name} Logo`} className="w-16 h-12" />
                  <div>
                    <p className="font-medium text-gray-800 text-xs text-center">{courier.name}</p>
                    <p className="text-xs text-gray-500 text-center">Surface | Min-weight: {courier.minWeight}</p>
                    <p className="text-xs text-gray-500 text-center">RTO Charges: {courier.rtoCharges}</p>
                  </div>
                </div>

                {/* Circular Rating Indicator */}
                <div className="w-1/6 text-center">
                  <CircularProgressbar
                    value={(courier.rating / 5) * 100}
                    text={`${courier.rating}`}
                    styles={buildStyles({
                      textSize: "20px",
                      pathColor: courier.rating >= 3 ? "#16A34A" : "#DC2626",
                      textColor: "black", // Set text color to black
                      trailColor: "#E5E7EB",
                    })}
                    className="w-12 h-12"
                  />
                </div>

                <div className="w-1/6 text-center text-xs text-gray-800">{courier.pickup}</div>
                <div className="w-1/6 text-center text-xs text-gray-800">{courier.delivery}</div>
                <div className="w-1/6 text-center text-xs text-gray-800">{courier.weight}</div>
                <div className="w-1/6 text-center text-xs text-gray-800">{courier.charges}</div>
                <div className="w-1/6 text-center">
                  <button className="px-2 py-1 bg-green-500 text-white font-semibold text-xs rounded hover:bg-green-600">
                    Ship now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierPage;
