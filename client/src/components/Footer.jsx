import React from "react";

const AdminFooter = () => {
    return (
        <footer className="admin-footer text-center py-3 mt-auto">
            <div className="container">
                <small>
                    © {new Date().getFullYear()} Petconnect. All rights reserved.
                </small>
            </div>
        </footer>
    );
};

export default AdminFooter;
