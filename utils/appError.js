class AppError extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode;
        this.starus = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;