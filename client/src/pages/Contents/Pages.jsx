import React, { useEffect, useState } from 'react';
import { getPages, deletePage } from '../../api/page';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { sortByField, renderSortIcon } from '../../utils/sortUtils';
import { adminRoute } from '../../utils/router';
import CommonModal from '../../components/common/CommonModal';

const PageList = () => {
    const [pages, setPages] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [deletingPage, setDeletingPage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const data = await getPages();
            setPages(data);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to fetch pages');
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredSortedPages = sortByField(
        pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase())),
        sortField,
        sortOrder
    );

    return (
        <div className="user-list-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Page List</h4>
                    <div className="d-flex gap-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-control form-control-sm theme-input-sm"
                            />
                        </div>
                        <div>
                            <button className='btn btn-md theme-btn' onClick={() => navigate(adminRoute('/pages/create'))}>
                                Create Page
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('title')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Title</span>
                                        {renderSortIcon('title', sortField, sortOrder)}
                                    </div>
                                </th>
                                <th>Slug</th>
                                <th>Created At</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSortedPages.map((page, index) => (
                                <tr key={page._id}>
                                    <td>{index + 1}</td>
                                    <td>{page.title}</td>
                                    <td>{page.slug}</td>
                                    <td>{new Date(page.createdAt).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => navigate(adminRoute(`/pages/${page.slug}`))}>
                                            View
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => navigate(adminRoute(`/pages/edit/${page.slug}`))}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger me-2"
                                            onClick={() => setDeletingPage(page)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSortedPages.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No pages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CommonModal
                show={!!deletingPage}
                onHide={() => setDeletingPage(null)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName={deletingPage?.name || 'this user'}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    try {
                        toast.success('User deleted successfully.');
                        await deletePage(deletingPage?._id);
                        await fetchPages();
                    } catch (err) {
                        toast.error(err?.message);
                    }
                    setDeletingPage(null);
                }}
            />

        </div>
    );
};

export default PageList;