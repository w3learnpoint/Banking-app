import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPage, getPageBySlug, updatePage } from '../../api/page';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { adminRoute } from '../../utils/router';

const EditPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!slug;

    const [form, setForm] = useState({
        _id: '',
        title: '',
        slug: '',
        content: ''
    });

    const [loading, setLoading] = useState(true);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadPage();
        } else {
            setLoading(false);
        }
    }, [slug]);

    const loadPage = async () => {
        try {
            const page = await getPageBySlug(slug);
            if (!page) throw new Error("Page not found");

            setForm({
                _id: page._id || '',
                title: page.title || '',
                slug: page.slug || '',
                content: page.content || ''
            });
            setSlugManuallyEdited(true);
        } catch (err) {
            toast.error("Failed to load page");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...form, [name]: value };

        if (name === 'title' && !slugManuallyEdited && !isEditMode) {
            updated.slug = generateSlug(value);
        }

        if (name === 'slug') {
            setSlugManuallyEdited(true);
        }

        setForm(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updatePage(form._id, form);
                toast.success("Page updated successfully");
            } else {
                await createPage(form);
                toast.success("Page created successfully");
            }
            navigate(adminRoute('/pages'));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    // ✅ Show loader or blank until loaded
    if (loading) return <div className="text-center py-5">Loading page...</div>;

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card theme-card p-4 shadow-sm">
                    <h4 className="theme-text mb-4">{isEditMode ? 'Edit Page' : 'Create Page'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="theme-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter page title"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Auto-generated from title"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Content</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={form.content}
                                onChange={(_, editor) =>
                                    setForm({ ...form, content: editor.getData() })
                                }
                            />
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn theme-btn">
                                {isEditMode ? 'Update Page' : 'Create Page'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
