import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import profile from '../assets/images/pic3.webp';
import { logout } from "../utils/auth";
import { adminRoute } from "../utils/router";
import { getUnreadNotifications } from "../api/notification";
import { getUnreadMessages } from "../api/message";

const AdminHeader = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, messageRes] = await Promise.all([
                    getUnreadNotifications(),
                    getUnreadMessages()
                ]);
                setNotifications(notifRes?.data);
                setMessages(messageRes?.data);
            } catch (err) {
                console.error("Header fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate(adminRoute('/login'));
        window.location.reload();
    };

    return (
        <header className="top-header py-2 border-bottom">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Left: Logo */}
                    <div className="logo">
                        <Link to={adminRoute("/dashboard")}>
                            <img src={logo} alt="logo" height={40} />
                        </Link>
                    </div>

                    {/* Right: Country + Notifications + Messages + User */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Country Selector */}
                        <select className="form-select form-select-sm theme-input-sm">
                            <option>Select Country</option>
                            <option value="India">India</option>
                            <option value="Australia">Australia</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Japan">Japan</option>
                            <option value="Italy">Italy</option>
                        </select>

                        {/* Notifications */}
                        <div className="dropdown">
                            <button className="btn btn_circle position-relative" data-bs-toggle="dropdown">
                                <i className="fa-regular fa-bell"></i>
                                {notifications.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: '250px', maxHeight: '300px', overflowY: 'auto' }}>
                                <li className="dropdown-header fw-bold">Notifications</li>
                                <li><hr className="dropdown-divider" /></li>
                                {notifications.length > 0 ? (
                                    notifications.map((note, idx) => (
                                        <li key={idx}>
                                            <div className="dropdown-item">
                                                <strong>{note.title}</strong><br />
                                                <small className="text-muted">{note.body}</small>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="dropdown-item text-muted">No new notifications</li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item text-center" to={adminRoute("/notifications")}>See all</Link></li>
                            </ul>
                        </div>

                        {/* Messages */}
                        <div className="dropdown">
                            <button className="btn btn_circle position-relative" data-bs-toggle="dropdown">
                                <i className="fa-regular fa-message"></i>
                                {messages.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                        {messages.length}
                                    </span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: '250px', maxHeight: '300px', overflowY: 'auto' }}>
                                <li className="dropdown-header fw-bold">Messages</li>
                                <li><hr className="dropdown-divider" /></li>
                                {messages.length > 0 ? (
                                    messages.map((msg, idx) => (
                                        <li key={idx}>
                                            <div className="dropdown-item theme-text">
                                                <strong>{msg.fromUser?.name || 'Unknown'}:</strong><br />
                                                <small className="text-muted">{msg.content}</small>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="dropdown-item text-muted">No new messages</li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item text-center" to={adminRoute("/messages")}>View all messages</Link></li>
                            </ul>
                        </div>

                        {/* User Profile */}
                        <div className="dropdown">
                            <button className="btn p-0 border-0 bg-transparent" data-bs-toggle="dropdown">
                                <img src={profile} alt="user" className="profile-avatar" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to={adminRoute("/user-profile")}>Profile</Link></li>
                                <li><Link className="dropdown-item" to={adminRoute("/user-settings")}>Settings</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" components="button" onClick={handleLogout}>Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
