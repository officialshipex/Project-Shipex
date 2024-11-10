
import Layout from "./Layout";
import Dashboard from "../components/Dashboard/DashBoard";
import { Routes, Route } from 'react-router-dom';
import OrderDashboard from '../components/Dashboard/OrderDashboard';

function DashBoardRoute() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/dashboard" element={<OrderDashboard />}/>
                <Route path="/orders" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>
    );
}

export default DashBoardRoute;
