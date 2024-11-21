import {    Outlet } from 'react-router-dom';

import Navbar from "../components/Common/NavBar";
import Sidebar from "../components/Common/SideBar";


function Layout() {
    return (<>
        <div className="flex h-full w-full" >
            <div className="h-full w-fit">
                <Sidebar />
            </div>
            <div className="flex flex-col h-screen w-full">
                <div className="sticky top-0 z-50">
                    <Navbar />
                </div>
                <div className=''>
                    <Outlet />
                </div>
            </div>
        </div>
    </>)
};

export default Layout;