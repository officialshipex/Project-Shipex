import React from 'react'
import Sidebar from '../components/Common/SideBar'
import Navbar from '../components/Common/Navbar'

const CourierDTDC = () => {
  return (
    <div className='flex'>
        <div className="bg-gray-200 h-screen w-16 fixed top-0 left-0">
        <Sidebar/>
        </div>
        <div className="ml-16 w-full">
        <Navbar/>
        </div>
           
        
    </div>
  )
}

export default CourierDTDC