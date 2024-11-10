import React from 'react'

const GeneralInformationB2B = () => {
    return (

        <div div className="bg-white p-4 md:p-6 shadow-lg rounded-lg" >
            <h2 className="text-lg font-semibold mb-2">General Information</h2>
            <h2>Please fill in the details:</h2>
            <div className="space-y-4">
                {/* Courier Name */}
                <div className="md:flex md:items-center md:justify-between">
                    <label className="text-sm block mb-2 md:mb-0">Courier Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="md:flex md:items-center md:justify-between">
                    <label className="text-sm block mb-2 md:mb-0">Client Id</label>
                    <input
                        type="text"
                        placeholder="Enter Client Id"
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="md:flex md:items-center md:justify-between">
                    <label className="text-sm block mb-2 md:mb-0">Email</label>
                    <input
                        type="text"
                        placeholder="Enter Email"
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="md:flex md:items-center md:justify-between">
                    <label className="text-sm block mb-2 md:mb-0">Client Secret</label>
                    <input
                        type="text"
                        placeholder="Enter client secret"
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                </div>


            </div>
        </div>
    )
}

export default GeneralInformationB2B;