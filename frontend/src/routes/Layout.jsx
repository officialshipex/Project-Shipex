import {    Outlet } from 'react-router-dom';

import Navbar from "../components/Common/NavBar";
import Sidebar from "../components/Common/SideBar";


function Layout() {
    return (<>
        <div className="flex h-screen w-full " >
            <div className="h-screen w-fit ">
                <Sidebar className=''/>
            </div>
            <div className="flex flex-col h-full w-full ">
                <div className='py-2 w-full'>
                    <Navbar />
                </div>
                <div className='w-full h-full'>
                    <div className=" ">
                    <Outlet />
                    </div>
                </div> 
            </div>
        </div>
    </>)
};

export default Layout;