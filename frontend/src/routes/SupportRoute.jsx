
import Support1 from "../components/Support/Support1";
import SupportArticle from "../components/Support/SupportArticle";
import SupportAwaitedResponse from "../components/Support/SupportAwaitedResponse";
import SupportClosed from "../components/Support/SupportClosed";
import SupportCreateList from "../components/Support/SupportCreateList";
import Layout from "./Layout";
import { Routes, Route } from 'react-router-dom';


function SupportRoute() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<SupportCreateList />} />
            </Route>
        </Routes>
    );
}

export default SupportRoute;
