// Import necessary modules
import React from "react";
// import Navbar from "../Common/NavBar";
// import Sidebar from "../Common/SideBar";

function Support1() {
  return (
    <div className="flex h-screen ">
      {/* <Sidebar className="hidden md:block w-64 bg-white border-r" /> */}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <Navbar /> */}

        {/* Support content */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 lg:p-16">
          <div className=" border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 ">
            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
              Support
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              Get help by creating or reading help articles.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 border-2 text-grey-500 font-semibold rounded-md w-48 h-14">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
                </svg>
                Create a ticket
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-white-500 text-grey-500 font-semibold rounded-md  w-48 h-14 border-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v14h14V5H5zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />
                </svg>
                Help Articles
              </button>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              {[
                {
                  label: "Open tickets",
                  value: 0,
                  bgColor: "bg-white-500",
                  textColor: "text-grey-600",
                  iconPath:
                    "M10 2a8 8 0 00-7.966 7.095A8 8 0 008 21h8a8 8 0 00-7.995-11A8 8 0 0010 2z",
                },
                {
                  label: "Work in progress tickets",
                  value: 0,
                  bgColor: "bbg-white-500",
                  textColor: "text-grey-600",
                  iconPath:
                    "M16 4v4h2V4h2v6h-6V8h4V6h-6v4h-4v2h6v2H4v-2h4V6H4v6h2v-2h8v4H6v2h10v2H4v-6h2V8h8V4z",
                },
                {
                  label: "Response awaited on",
                  value: 0,
                  bgColor: "bg-white-500",
                  textColor: "text-grey-600",
                  iconPath:
                    "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 10H8v-2h3V7h2v3h3v2h-3v3h-2v-3z",
                },
                {
                  label: "Overdue tickets",
                  value: 0,
                  bgColor: "bg-white-500",
                  textColor: "text-grey-600",
                  iconPath:
                    "M6 2h12l2 2v14l-2 2H6l-2-2V4l2-2zm0 4v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z",
                },
                {
                  label: "Tickets resolved",
                  value: 0,
                  bgColor: "bbg-white-500",
                  textColor: "text-grey-600",
                  iconPath:
                    "M5 13l4 4L19 7l-1.41-1.41L9 15.17l-2.59-2.58L5 13z",
                },
                {
                  label: "Avg resolution time",
                  value: "1d",
                  bgColor: "bg-white-500",
                  textColor: "text-grey-600",
                  iconPath: "M13 2h-2v8h8v-2h-6V2zM2 13h8v-2H2v8h2v-6z",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border-2  ${item.bgColor}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={item.iconPath} />
                  </svg>
                  <span
                    className={`${item.textColor} font-semibold text-sm sm:text-base`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`${item.textColor} font-bold text-base sm:text-lg`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="Search by Ticket ID, AWB, Pickup ID"
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm sm:text-base w-1/2 "
              />
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-gray-300 mb-4 sm:mb-6">
              <nav className="flex gap-4 sm:gap-8 text-sm sm:text-base">
                <a
                  href="#open"
                  className="pb-2 text-gray-500 border-b-2 border-green-500 font-medium"
                >
                  Open
                </a>
                <a
                  href="#awaited-response"
                  className="pb-2 text-gray-600 hover:text-gray-900"
                >
                  Awaited Response
                </a>
                <a
                  href="#closed"
                  className="pb-2 text-gray-600 hover:text-gray-900"
                >
                  Closed
                </a>
              </nav>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
              <select className="w-full sm:w-1/6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm sm:text-base">
                <option>Select the days</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
              <select className="w-full sm:w-1/6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm sm:text-base">
                <option>Select Status</option>
                <option>Open</option>
                <option>Closed</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Awaiting Response</option>
              </select>
              <select className="w-full sm:w-1/6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 text-sm sm:text-base">
                <option>Choose Sub category</option>
                <option>General Inquiry</option>
                <option>Technical Issue</option>
                <option>Billing</option>
                <option>Account Management</option>
                <option>Shipping</option>
              </select>
            </div>

            {/* Ticket List */}

            <div className="overflow-auto">
              <table className="min-w-full bg-gray-100 border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="text-gray-600 text-left">
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Ticket ID
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      AWBs
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Sub Category
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Ticket status
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Resolution due by
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Last updates
                    </th>
                    <th className="px-2 sm:px-4 py-2 font-semibold border-b bg-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* First Row */}
                  <tr className="text-gray-700 bg-white border-b">
                    <td className="px-2 sm:px-4 py-3">7D105973887</td>
                    <td className="px-2 sm:px-4 py-3">7D105973887</td>
                    <td className="px-2 sm:px-4 py-3">
                      Issue Over Weight Discrepancy
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-yellow-500 font-semibold">
                      OPEN
                    </td>
                    <td className="px-2 sm:px-4 py-3">20 Aug 2024, 02:50 PM</td>
                    <td className="px-2 sm:px-4 py-3">13 Aug 2024, 02:50 PM</td>
                    <td className="px-2 sm:px-4 py-3">
                      <button className="px-3 sm:px-4 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                        Update
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support1;
