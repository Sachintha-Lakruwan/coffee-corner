function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // JWT authentication error
        return res
            .status(401)
            .json({ message: 'The user is not authorized', error: err.message })
    }
    // Default to 500 server error
    return res
        .status(500)
        .json({ message: 'Internal server error', error: err.message })
}

module.exports = errorHandler
