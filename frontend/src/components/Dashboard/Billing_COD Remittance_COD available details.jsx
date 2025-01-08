import React from 'react';

function COD({ closeModal }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md md:max-w-lg lg:max-w-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">COD Available Details</h2>
          <button onClick={closeModal} className="text-gray-500 text-2xl">&times;</button>
        </div>
        <div className="border-t border-b border-gray-200">
          <table className="w-full text-left text-sm border border-gray-300">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-2 font-semibold border-r border-gray-300">Remittance Type</th>
                <th className="px-4 py-2 font-semibold border-r border-gray-300">COD Amount</th>
              
                
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 border-r border-gray-300">Advanced COD</td>
                
                <td className="px-4 py-2 text-green-500 cursor-pointer border-r border-gray-300">54</td>
                
              </tr>

              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 border-r border-gray-300">Standard</td>
                
                <td className="px-4 py-2 text-green-500 cursor-pointer border-r border-gray-300">4500</td>
                
              </tr>
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  );
}

export default COD;
