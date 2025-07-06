import { Link } from "react-router-dom";
import { adminRoute } from "../utils/router";

const Sidebar = () => {
    return (
        <div className="container-fluid main-area">
            <div className="row g-0">
                <div className="col-sm-2">
                    <div className="sidebar">
                        <ul className="nav flex-column" id="sidebar">
                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Dashboard">
                                <Link className="nav-link" to={adminRoute('/dashboard')}>
                                    <i className="fa-solid fa-house"></i>
                                    <span className="nav-link-text">Dashboard</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="CRM">
                                <Link className="nav-link" to={adminRoute('/roles')}>
                                    <i className="fa-solid fa-user-secret"></i>
                                    <span className="nav-link-text">Roles</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/permissions')}>
                                    <i className="fa-solid fa-user-lock"></i>
                                    <span className="nav-link-text">Permissions</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/users')}>
                                    <i className="fa-solid fa-users"></i>
                                    <span className="nav-link-text">Users</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/accounts')}>
                                    <i className="fa-solid fa-building-columns"></i>
                                    <span className="nav-link-text">Accounts</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/pages')}>
                                    <i className="fa-solid fa-file-word"></i>
                                    <span className="nav-link-text">Pages</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/notifications')}>
                                    <i className="fa-solid fa-bell"></i>
                                    <span className="nav-link-text">Notifications</span>
                                </Link >
                            </li>

                            <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Business">
                                <Link className="nav-link" to={adminRoute('/messages')}>
                                    <i className="fa-solid fa-message"></i>
                                    <span className="nav-link-text">Messages</span>
                                </Link >
                            </li>

                        </ul>
                    </div>
                </div>
                <div className="col-sm-10"></div>
            </div>
        </div>
    )
}

export default Sidebar;