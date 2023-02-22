const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  console.log("inside handleCastError");
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const name = err.keyValue.name;
  console.log("Name in handleDuplicateFieldsDB ->", name);
  const message = `Duplicate field value: "${name}". Please use another value!`; 
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational trusted error: send message to client
  if (err.isOperational) {
    console.log("inside if");
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  // Programming or other unknow error: don't leak error details 
  } else {
    // 1) Log error
    // console.error("Error 🛑🔍", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === "Validation failed") error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};