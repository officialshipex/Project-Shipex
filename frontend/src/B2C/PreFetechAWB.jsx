import React from 'react'
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa'; // Importing plus and times icons


const PreFetechAWB = () => {
  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-1">Prefetch AWB</h2>
      <p className="text-gray-600 text-sm mb-4">
        Share and upload the AWBs you have received from Courier
      </p>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="text-sm text-gray-700">Upload new file</div>
        <div className="flex items-center space-x-4">
          <label className="flex justify-center items-center bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md cursor-pointer">
            <FaUpload className="mr-2" /> {/* Add upload icon here */}
            <input
              type="file"
              className="hidden"
            />
            <span className="text-green-500">Upload</span>
          </label>
        </div>
      </div>
      <a href="#" className="text-blue-500 text-sm flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.707 13.707a1 1 0 01-1.414 0L4 10.414V13a1 1 0 11-2 0v-5a1 1 0 011-1h5a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414zM10 17a1 1 0 100-2h8a1 1 0 100 2h-8z" clipRule="evenodd" />
        </svg>
        Download Sample File
      </a>
    </div>
  )
}

export default PreFetechAWB