import React, { useState } from 'react'

const GeneralInformation = (props) => {
    let [name,setName]=useState()
    // props.handleCourierName(name)
    // console.log(props.fun(name))
    let handleName=(e)=>{
        setName(e.target.value)
        props.fun(e.target.value)
    }
    return (

        <div div className="bg-white p-4 md:p-6 shadow-lg rounded-lg" >
            <h2 className="text-lg font-semibold mb-2">General Information</h2>
            <div className="space-y-4">
                {/* Courier Name */}
                <div className="md:flex md:items-center md:justify-between">
                    <label className="text-sm block mb-2 md:mb-0">Courier Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                        onChange={handleName}
                    />
                </div>


            </div>
        </div>
    )
}

export default GeneralInformation