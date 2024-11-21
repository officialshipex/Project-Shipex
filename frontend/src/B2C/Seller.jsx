import React from 'react'

const Seller = () => {
  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Sellers Panel</h2>
      <p className="text-gray-600 text-sm mb-4">
        Please provide below given Credentials for DTDC Surface 10kg
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'User Name', type: 'text', placeholder: 'Username' },
          { label: 'Password', type: 'password', placeholder: 'Password' },
          { label: 'Token', type: 'text', placeholder: 'Token' },
          { label: 'Api Key', type: 'text', placeholder: 'Api Key' },
          { label: 'Customer Code', type: 'text', placeholder: 'Customer Code' },
          { label: 'Service Type ID', type: 'text', placeholder: 'Service Type ID' },
          { label: 'Tracking Api Key', type: 'text', placeholder: 'Tracking Api Key' },
        ].map(({ label, type, placeholder }, index) => (
          <div key={index}>
            <label className="text-sm block mb-1">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Seller