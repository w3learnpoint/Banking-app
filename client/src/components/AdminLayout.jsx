import AdminFooter from "./Footer";
import { Outlet } from "react-router-dom";
import AdminHeader from "./Header";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <AdminHeader />
            <div className="d-flex flex-grow-1">
                {/* Sidebar */}
                <div className="col-sm-2 p-0">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="col-sm-10 main-content">
                    <Outlet />
                </main>
            </div>
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
