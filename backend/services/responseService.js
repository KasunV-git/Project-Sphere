/**
 * Send a successful API response.
 */
const sendSuccess = (
    res,
    statusCode,
    data = {},
    message = null
) => {

    const response = {
        success: true
    };

    if (message) {
        response.message = message;
    }

    Object.assign(response, data);

    return res
        .status(statusCode)
        .json(response);

};

/**
 * Send an error API response.
 */
const sendError = (
    res,
    statusCode,
    message
) => {

    return res
        .status(statusCode)
        .json({
            success: false,
            message
        });

};

module.exports = {
    sendSuccess,
    sendError
};