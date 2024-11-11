// // Components/Support1.js
// import React from "react";
// import Navbar from "../Common/Navbar";
// import Sidebar from "../Common/Sidebar";

// function Support1() {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1">
//         {/* Navbar */}
//         <Navbar />

//         {/* Main Support content */}
//         <div className="p-6 md:p-10 lg:p-16 bg-gray-100 text-gray-900">
//           <div className="border border-gray-200 rounded-lg p-8 bg-white">
//             {/* Header */}
//             <h2 className="text-2xl font-semibold mb-4">Support</h2>
//             <p className="text-gray-600 mb-6">
//               Get help by creating or reading help articles.
//             </p>

//             {/* Buttons */}
//             <div className="flex flex-wrap gap-4 mb-8">
//               <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
//                 <span className="material-icons">add_circle</span> Create a
//                 ticket
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
//                 <span className="material-icons">description</span> Help
//                 Articles
//               </button>
//             </div>

//             {/* Overview */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//               {[
//                 {
//                   label: "Open tickets",
//                   value: 0,
//                   bgColor: "bg-green-100",
//                   textColor: "text-green-600",
//                 },
//                 {
//                   label: "Work in progress tickets",
//                   value: 0,
//                   bgColor: "bg-yellow-100",
//                   textColor: "text-yellow-600",
//                 },
//                 {
//                   label: "Response awaited on",
//                   value: 0,
//                   bgColor: "bg-purple-100",
//                   textColor: "text-purple-600",
//                 },
//                 {
//                   label: "Overdue tickets",
//                   value: 0,
//                   bgColor: "bg-red-100",
//                   textColor: "text-red-600",
//                 },
//                 {
//                   label: "Tickets resolved",
//                   value: 0,
//                   bgColor: "bg-green-100",
//                   textColor: "text-green-600",
//                 },
//                 {
//                   label: "Avg resolution time",
//                   value: "1d",
//                   bgColor: "bg-blue-100",
//                   textColor: "text-blue-600",
//                 },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className={`flex items-center justify-between p-4 rounded-lg ${item.bgColor}`}
//                 >
//                   <span className={`${item.textColor} font-semibold`}>
//                     {item.label}
//                   </span>
//                   <span className={`${item.textColor} font-bold text-lg`}>
//                     {item.value}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Search */}
//             <div className="mb-6">
//               <input
//                 type="text"
//                 placeholder="Search by Ticket ID, AWB, Pickup ID"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* Tabs */}
//             <div className="border-b border-gray-300 mb-4">
//               <nav className="flex gap-8">
//                 <a
//                   href="#open"
//                   className="pb-2 text-blue-500 border-b-2 border-blue-500 font-medium"
//                 >
//                   Open
//                 </a>
//                 <a
//                   href="#awaited-response"
//                   className="pb-2 text-gray-600 hover:text-gray-900"
//                 >
//                   Awaited Response
//                 </a>
//                 <a
//                   href="#closed"
//                   className="pb-2 text-gray-600 hover:text-gray-900"
//                 >
//                   Closed
//                 </a>
//               </nav>
//             </div>

//             {/* Filters */}
//             <div className="flex flex-wrap gap-4 mb-4">
//               <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
//                 <option>Select the days</option>
//               </select>
//               <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
//                 <option>Select Status</option>
//               </select>
//               <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
//                 <option>Choose Sub category</option>
//               </select>
//             </div>

//             {/* Ticket List */}
//             <div className="overflow-auto">
//               <table className="min-w-full bg-white border border-gray-200">
//                 <thead>
//                   <tr className="text-gray-600 text-left">
//                     <th className="px-4 py-2 font-semibold border-b">
//                       Ticket ID
//                     </th>
//                     <th className="px-4 py-2 font-semibold border-b">AWBs</th>
//                     <th className="px-4 py-2 font-semibold border-b">
//                       Sub Category
//                     </th>
//                     <th className="px-4 py-2 font-semibold border-b">
//                       Ticket status
//                     </th>
//                     <th className="px-4 py-2 font-semibold border-b">
//                       Resolution due by
//                     </th>
//                     <th className="px-4 py-2 font-semibold border-b">
//                       Last updates
//                     </th>
//                     <th className="px-4 py-2 font-semibold border-b">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="text-gray-700">
//                     <td className="px-4 py-2 border-b">7D105973887</td>
//                     <td className="px-4 py-2 border-b">7D105973887</td>
//                     <td className="px-4 py-2 border-b">
//                       Issue Over Weight Discrepancy
//                     </td>
//                     <td className="px-4 py-2 border-b text-yellow-500 font-semibold">
//                       OPEN
//                     </td>
//                     <td className="px-4 py-2 border-b">
//                       20 Aug 2024, 02:50 PM
//                     </td>
//                     <td className="px-4 py-2 border-b">
//                       13 Aug 2024, 02:50 PM
//                     </td>
//                     <td className="px-4 py-2 border-b">
//                       <button className="px-4 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
//                         Update
//                       </button>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Support1;
