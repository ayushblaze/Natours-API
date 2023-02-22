class AppError extends Error {
  constructor(message, statusCode) {
    // The parent class is Error and whatever we pass into it is gonna be the message property
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;