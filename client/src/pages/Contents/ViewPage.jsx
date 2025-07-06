import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../../api/page';

const ViewPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await getPageBySlug(slug);
                setPage(res);
            } catch (err) {
                setPage(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="text-center mt-5">Loading page...</div>;

    if (!page) return <div className="text-center mt-5 text-danger">Page not found.</div>;

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-lg p-4">
                <h2 className="mb-4 text-primary">{page.title}</h2>
                <div
                    className="page-content"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
};

export default ViewPage;
