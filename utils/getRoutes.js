// utils/getRoutes.js
export const extractRoutes = (app) => {
    const routes = [];

    const traverse = (stack, prefix = '') => {
        stack.forEach(layer => {
            if (layer.route) {
                const path = prefix + layer.route.path;
                const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
                methods.forEach(method => {
                    routes.push({ method, route: path });
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                const mountPath = layer.regexp.source
                    .replace('^\\/', '/')      // Remove ^\
                    .replace('\\/?(?=\\/|$)', '') // Remove tail
                    .replace(/\\\//g, '/');    // Remove backslashes

                traverse(layer.handle.stack, prefix + mountPath);
            }
        });
    };

    traverse(app._router.stack);

    return routes;
};
