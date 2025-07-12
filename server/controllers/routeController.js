import { errorResponse, successResponse } from "../utils/response.js";

export const getAllRoutes = (req, res) => {
    try {
        const routes = [];

        const cleanPath = (path) => {
            if (!path) return '';
            return path
                .replace(/\(.*?\)/g, '')      // remove all non-capturing groups like (=/|$)
                .replace(/\^/g, '')           // remove starting ^
                .replace(/\$$/, '')           // remove trailing $
                .replace(/\\\//g, '/')        // unescape slashes
                .replace(/\?$/, '')           // remove trailing ?
                .replace(/\/+/g, '/')         // normalize multiple slashes
                .replace(/\/$/, '')           // remove trailing slash
                .replace(/^\/api/, '')        // remove /api prefix
                .trim();
        };

        const traverse = (stack, prefix = '') => {
            for (const layer of stack) {
                if (layer.route && layer.route.path) {
                    const methods = Object.keys(layer.route.methods);
                    const path = prefix + layer.route.path;

                    for (const method of methods) {
                        routes.push({
                            method: method.toUpperCase(),
                            route: cleanPath(path)
                        });
                    }
                } else if (layer.name === 'router' && layer.handle?.stack) {
                    const prefixPart = cleanPath(layer.regexp?.source);
                    traverse(layer.handle.stack, prefix + prefixPart);
                }
            }
        };

        traverse(req.app._router.stack);

        // Remove duplicates by method + route
        const uniqueRoutes = Array.from(
            new Map(routes.map(r => [`${r.method}:${r.route}`, r])).values()
        );

        return successResponse(res, 200, 'Routes fetched successfully', uniqueRoutes);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to fetch routes', err.message);
    }
};
