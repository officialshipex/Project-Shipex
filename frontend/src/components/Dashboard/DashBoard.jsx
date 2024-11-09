// import React from 'react';
import Sidebar from "../Common/SideBar";

const Dashboard = () => {
  return (
    <div className="dashboard-container flex h-screen bg-gray-100">
      {/* Sidebar positioned at the top left */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col items-center p-5">
        {/* Heading Section */}
        <h4 className="text-xl font-semibold mb-20 text-left w-full pl-5 mt-11">
          Get Started with These:
        </h4>

        {/* Action Cards Section */}
        <div className="flex flex-col items-center mt-4">
          <div className="action-cards flex justify-center gap-4">
            <div className="card flex-1 max-w-xs h-64 p-4 bg-gray-50 border border-green-300 rounded-lg text-center hover:border-green-500">
              <div className="card-icon flex justify-center items-center mb-3">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 101 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_1117_21397"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="101"
                    height="100"
                  >
                    <rect x="0.5" width="100" height="100" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_1117_21397)">
                    <path
                      d="M21.3333 33.3333H56.5417H54.6667H56.125H21.3333ZM23 25H78L74.4583 20.8333H26.5417L23 25ZM42.1667 53.125L50.5 48.9583L58.8333 53.125V33.3333H42.1667V53.125ZM61.125 87.5H21.3333C19.0417 87.5 17.0799 86.684 15.4479 85.0521C13.816 83.4201 13 81.4583 13 79.1667V27.1875C13 26.2153 13.1563 25.2778 13.4688 24.375C13.7813 23.4722 14.25 22.6389 14.875 21.875L20.0833 15.5208C20.8472 14.5486 21.8021 13.8021 22.9479 13.2812C24.0938 12.7604 25.2917 12.5 26.5417 12.5H74.4583C75.7083 12.5 76.9063 12.7604 78.0521 13.2812C79.1979 13.8021 80.1528 14.5486 80.9167 15.5208L86.125 21.875C86.75 22.6389 87.2188 23.4722 87.5313 24.375C87.8438 25.2778 88 26.2153 88 27.1875V47.6042C86.6806 47.1181 85.3264 46.7361 83.9375 46.4583C82.5486 46.1806 81.125 46.0417 79.6667 46.0417V33.3333H67.1667V49.2708C64.7361 50.6597 62.6181 52.3785 60.8125 54.4271C59.007 56.4757 57.5833 58.7847 56.5417 61.3542L50.5 58.3333L33.8333 66.6667V33.3333H21.3333V79.1667H56.125C56.6806 80.7639 57.375 82.2569 58.2083 83.6458C59.0417 85.0347 60.0139 86.3194 61.125 87.5ZM75.5 87.5V75H63V66.6667H75.5V54.1667H83.8333V66.6667H96.3333V75H83.8333V87.5H75.5Z"
                      fill="#566660"
                    />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Shipment</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add your order shipment request to be picked up.
              </p>
              <button className="action-button bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                Add order
              </button>
            </div>

            <div className="card flex-1 max-w-xs h-64 p-4 bg-gray-50 border border-green-300 rounded-lg text-center hover:border-green-500">
              <div className="card-icon flex justify-center items-center mb-3">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 101 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_1117_21407"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="101"
                    height="100"
                  >
                    <rect x="0.5" width="100" height="100" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_1117_21407)">
                    <path
                      d="M17.1666 49.9998H83.8333V33.3332H17.1666V49.9998ZM79.6666 91.6665V79.1665H67.1666V70.8332H79.6666V58.3332H88V70.8332H100.5V79.1665H88V91.6665H79.6666ZM17.1666 83.3332C14.875 83.3332 12.9132 82.5172 11.2812 80.8853C9.64929 79.2533 8.83331 77.2915 8.83331 74.9998V24.9998C8.83331 22.7082 9.64929 20.7464 11.2812 19.1144C12.9132 17.4825 14.875 16.6665 17.1666 16.6665H83.8333C86.125 16.6665 88.0868 17.4825 89.7187 19.1144C91.3507 20.7464 92.1666 22.7082 92.1666 24.9998V49.9998H79.6666C73.9028 49.9998 68.9896 52.0311 64.9271 56.0936C60.8646 60.1561 58.8333 65.0693 58.8333 70.8332V83.3332H17.1666Z"
                      fill="#566660"
                    />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recharge Wallet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add money to make the shipping process easier.
              </p>
              <button className="action-button bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                Recharge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
