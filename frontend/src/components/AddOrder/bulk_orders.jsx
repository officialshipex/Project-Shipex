import React from "react";

const BulkOrderPage = () => {
  return (
    <div className="p-8 bg-gray-100 flex-1">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 border rounded bg-gray-100 hover:bg-green-500 hover:text-white">
          Single Shipment
        </button>
        <button className="px-4 py-2 border rounded bg-green-500 text-white">
          Bulk Order
        </button>
        <button className="px-4 py-2 border rounded bg-gray-100 hover:bg-green-500 hover:text-white">
          Quick Shipment
        </button>
        <button className="px-4 py-2 border rounded bg-gray-100 hover:bg-green-500 hover:text-white">
          B2B
        </button>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Import Bulk Order</h2>
        <div className="border-2 border-dashed border-gray-300 bg-white p-8 text-center rounded-lg">
          <p className="text-gray-600">Drag and drop the files here</p>
          <p className="text-gray-600 my-2">OR</p>
          <button className="px-6 py-2 border border-green-500 text-green-500 rounded hover:bg-gray-100">
            Browse and Upload
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Only csv, xls & xlsx file formats will be accepted.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 p-6 bg-yellow-100 border border-yellow-300 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Instructions</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Download the sample file and replace its data with your order data.
            Save the file and upload it back.
          </li>
          <li>Make sure all mandatory fields are filled in the sheet.</li>
          <li>
            You can view the successfully uploaded orders in{" "}
            <strong>New Orders</strong> tab in the order's panel. AWB assigned
            orders can be viewed in the <strong>Ready to Ship</strong> tab.
          </li>
          <li>
            In case there are errors in the file, download the error file, and
            fix errors with correct data & re-upload the file.
          </li>
        </ul>
      </div>

      {/* Upload Status Table */}
      <div className="bg-gray-200 shadow rounded-lg p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                File Name
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                Date
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                No. of Uploaded Orders
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                Successfully Uploaded Order
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                Uploaded Order Status
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-sm">
                Error Order
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-400">
              <td
                colSpan="6"
                className="py-5 text-center text-gray-500 text-sm"
              >
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkOrderPage;
