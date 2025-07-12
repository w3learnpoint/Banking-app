export const successResponse = (res, statusCode = 200, message = "Success", data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, statusCode = 500, message = "Something went wrong", error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? error : undefined
    });
};

export const badRequestResponse = (res, statusCode = 400, message = "Bad Request", error = null) => {
    return errorResponse(res, statusCode, message, error);
};

export const unauthorizedResponse = (res, statusCode = 401, message = "Unauthorized") => {
    return errorResponse(res, statusCode, message);
};

export const forbiddenResponse = (res, statusCode = 403, message = "Forbidden") => {
    return errorResponse(res, statusCode, message);
};

export const notFoundResponse = (res, statusCode = 404, message = "Not Found") => {
    return errorResponse(res, statusCode, message);
};
