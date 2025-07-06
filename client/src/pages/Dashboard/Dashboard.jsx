import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/user';
import { getRoles } from '../../api/role';
import { getPermissionsByRole } from '../../api/permission';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import PermissionList from './PermissionList';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';

const COLORS = ['#00C49F', '#FF8042', '#8884d8', '#FFBB28', '#FF6384'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissionsByRoleData, setPermissionsByRoleData] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const userResponse = await getUsers({ page: 1, limit: 1000 });
            const roleResponse = await getRoles();

            setUsers(userResponse.users);
            setRoles(roleResponse);

            // Fetch permissions for each role
            const permissionsData = await Promise.all(
                roleResponse.map(async (role) => {
                    const permissions = await getPermissionsByRole(role.roleType);
                    return {
                        role: role.name,
                        count: permissions.length,
                        methods: permissions.map(p => `${p.method.toUpperCase()} ${p.route}`)
                    };
                })
            );

            setPermissionsByRoleData(permissionsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error.message);
        }
    };

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status).length;
    const inactiveUsers = totalUsers - activeUsers;
    const totalRoles = roles.length;
    const totalPermissions = permissionsByRoleData.reduce((acc, curr) => acc + curr.count, 0);

    const usersByRole = roles.map(role => ({
        role: role.name,
        count: users.filter(user => user.role?._id === role._id).length,
    }));

    const statusData = [
        { name: 'Active Users', value: activeUsers },
        { name: 'Inactive Users', value: inactiveUsers },
    ];

    return (
        <div className="view-user-wrapper px-4 py-4 theme-bg">
            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card theme-card border-0 shadow p-3 text-center">
                        <h5 className="theme-text">Total Users</h5>
                        <h3>{totalUsers}</h3>
                        <button
                            className="btn btn-sm theme-btn mt-2"
                            onClick={() => navigate(adminRoute('/users'))}
                        >
                            View More
                        </button>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card theme-card border-0 shadow p-3 text-center">
                        <h5 className="theme-text">Active Users</h5>
                        <h3>{activeUsers}</h3>
                        <button
                            className="btn btn-sm theme-btn mt-2"
                            onClick={() => navigate(adminRoute('users?status=active'))}
                        >
                            View More
                        </button>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card theme-card border-0 shadow p-3 text-center">
                        <h5 className="theme-text">Total Roles</h5>
                        <h3>{totalRoles}</h3>
                        <button
                            className="btn btn-sm theme-btn mt-2"
                            onClick={() => navigate(adminRoute('/roles'))}
                        >
                            View More
                        </button>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card theme-card border-0 shadow p-3 text-center">
                        <h5 className="theme-text">Total Permissions</h5>
                        <h3>{totalPermissions}</h3>
                        <button
                            className="btn btn-sm theme-btn mt-2"
                            onClick={() => navigate(adminRoute('/permissions'))}
                        >
                            View More
                        </button>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-6 mb-4">
                    <div className="card theme-card border-0 shadow p-3">
                        <h5 className="theme-text mb-3">Users by Role</h5>
                        {usersByRole.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usersByRole}>
                                    <XAxis dataKey="role" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted">No role data available</p>
                        )}
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card theme-card border-0 shadow p-3">
                        <h5 className="theme-text mb-3">User Status</h5>
                        {totalUsers > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted">No user data available</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card theme-card border-0 shadow p-3">
                        <h5 className="theme-text mb-3">Permissions by Role</h5>
                        <div className="table-responsive">
                            <table className="table theme-table table-bordered align-middle">
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        <th>Total Permissions</th>
                                        <th>Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissionsByRoleData.length > 0 ? (
                                        permissionsByRoleData.map((p) => (
                                            <tr key={p.role}>
                                                <td><strong>{p.role}</strong></td>
                                                <td>{p.count}</td>
                                                <td>
                                                    <PermissionList permissions={p.methods} role={p.role} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center theme-text-muted">
                                                No permissions available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
