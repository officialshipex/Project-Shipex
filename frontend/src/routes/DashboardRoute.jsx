
import Layout from "./Layout";
import Dashboard from "../components/Dashboard/DashBoard";
import { Routes, Route } from 'react-router-dom';
import OrderDashboard from '../components/Dashboard/OrderDashboard';
import OrderList from "../components/Dashboard/MainOrder";
import ReturnList from "../components/Dashboard/Main_Return_Request";
import Ndr from "../components/Dashboard/Main_ndr";
import BillingList from "../components/Dashboard/main_Billing";

function DashBoardRoute() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/dashboard" element={<OrderDashboard />}/>
                <Route path="/orders" element={<OrderList />} />
                <Route path="/return_orders" element={<ReturnList />} />
                <Route path="/weight_calculator" element={<>weight_calculator</>} />
                <Route path="/NDR" element={<Ndr/>} />
                <Route path="/billing" element={<BillingList/>} />
                <Route path="/tools" element={<>tools</>} />
                <Route path="/management" element={<>management</>} />
                <Route path="/help" element={<>help</>} />
                <Route path="/settings" element={<>Settings</>} />
            </Route>
        </Routes>
    );
}

export default DashBoardRoute;
