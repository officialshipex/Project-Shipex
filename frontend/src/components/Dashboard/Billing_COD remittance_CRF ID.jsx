import React from 'react';

function Modal({ closeModal }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md md:max-w-lg lg:max-w-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">CRF ID</h2>
          <button onClick={closeModal} className="text-gray-500 text-2xl">&times;</button>
        </div>
        <div className="border-t border-b border-gray-200">
          <table className="w-full text-left text-sm border border-gray-300">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-2 font-semibold border-r border-gray-300">Delivery Date , Time</th>
                <th className="px-4 py-2 font-semibold border-r border-gray-300">Order ID</th>
                <th className="px-4 py-2 font-semibold border-r border-gray-300">AWB Number</th>
                <th className="px-4 py-2 font-semibold border-r border-gray-300">Courier Name</th>
                <th className="px-4 py-2 font-semibold">Order Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 border-r border-gray-300">Wed, Aug 14 2024 16:05:37</td>
                <td className="px-4 py-2 text-green-500 cursor-pointer border-r border-gray-300">6644654</td>
                <td className="px-4 py-2 border-r border-gray-300">2389749325407</td>
                <td className="px-4 py-2 border-r border-gray-300">Amazon Shipping Surface 1kg</td>
                <td className="px-4 py-2">₹ 5680</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600">Export</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
