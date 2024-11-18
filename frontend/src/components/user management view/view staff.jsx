import React, { useState } from "react";
import NavBar from "../Common/NavBar";
import Sidebar from "../Common/Sidebar";

const ViewStaff = () => {
  // Sample staff data
  const staffMembers = [
    { id: 1, name: "Raj Sharma", email: "raj.sharma@gmail.com", mobile: "7564936583", status: false },
    { id: 2, name: "Raj Sharma", email: "raj.sharma@gmail.com", mobile: "7564936583", status: false },
    { id: 3, name: "Raj Sharma", email: "raj.sharma@gmail.com", mobile: "7564936583", status: true },
    { id: 4, name: "Raj Sharma", email: "raj.sharma@gmail.com", mobile: "7564936583", status: false },
  ];

  const [staff, setStaff] = useState(staffMembers);

  // Toggle function for status
  const handleToggle = (id) => {
    setStaff((prevStaff) =>
      prevStaff.map((member) =>
        member.id === id ? { ...member, status: !member.status } : member
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Container with Title and Add Staff Button on the Same Line */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold">View Staff</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Add Staff
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Mobile</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{member.name}</td>
                <td className="py-2 px-4 border-b">{member.email}</td>
                <td className="py-2 px-4 border-b">{member.mobile}</td>
                <td className="py-2 px-4 border-b text-center">
                  <div
                    onClick={() => handleToggle(member.id)} // Call handleToggle for each row
                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                      member.status ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        member.status ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Staff = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1 p-4 bg-gray-100 overflow-auto">
          <ViewStaff />
        </main>
      </div>
    </div>
  );
};

export default Staff;
