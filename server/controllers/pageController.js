import slugify from 'slugify';
import Page from '../models/Page.js';
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    badRequestResponse
} from '../utils/response.js';

const isEmpty = (value) => !value || value.trim() === '';

// ✅ Create Page
export const createPage = async (req, res) => {
    try {
        let { title, slug, content } = req.body;

        if (isEmpty(title)) {
            return badRequestResponse(res, 400, "Title is required");
        }

        // Auto-generate slug if not provided
        slug = slug?.trim() || slugify(title, { lower: true, strict: true });

        // Check for existing slug
        const exists = await Page.findOne({ slug });
        if (exists) {
            return badRequestResponse(res, 400, "A page with this slug already exists");
        }

        const page = await Page.create({ title: title.trim(), slug, content });
        return successResponse(res, 201, "Page created successfully", page);
    } catch (err) {
        return errorResponse(res, 500, "Failed to create page", err.message);
    }
};

// ✅ Get All Pages
export const getAllPages = async (req, res) => {
    try {
        const pages = await Page.find().sort({ createdAt: -1 });
        return successResponse(res, 200, "Pages fetched successfully", pages);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch pages", err.message);
    }
};

// ✅ Get Page by Slug
export const getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await Page.findOne({ slug });
        if (!page) return notFoundResponse(res, 404, "Page not found");

        return successResponse(res, 200, "Page fetched successfully", page);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch page", err.message);
    }
};

// ✅ Update Page
export const updatePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        let { title, slug, content } = req.body;

        if (isEmpty(title)) {
            return badRequestResponse(res, 400, "Title is required");
        }

        // Auto-generate slug if not provided
        slug = slug?.trim() || slugify(title, { lower: true, strict: true });

        // Check if new slug conflicts with another page
        const existingSlug = await Page.findOne({ slug, _id: { $ne: pageId } });
        if (existingSlug) {
            return badRequestResponse(res, 400, "Another page with this slug already exists");
        }

        const page = await Page.findByIdAndUpdate(
            pageId,
            { title: title.trim(), slug, content },
            { new: true }
        );

        if (!page) return notFoundResponse(res, 404, "Page not found");

        return successResponse(res, 200, "Page updated successfully", page);
    } catch (err) {
        return errorResponse(res, 500, "Failed to update page", err.message);
    }
};

// ✅ Delete Page
export const deletePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const deleted = await Page.findByIdAndDelete(pageId);
        if (!deleted) return notFoundResponse(res, 404, "Page not found");

        return successResponse(res, 200, "Page deleted successfully");
    } catch (err) {
        return errorResponse(res, 500, "Failed to delete page", err.message);
    }
};
