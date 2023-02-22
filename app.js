const express = require('express');
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());



// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Mounting the routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter); 

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server.`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on the server.`);
  // err.status = "fail";
  // err.statusCode = 404;

  // Express assumes whatever we send to the next function is an error
  // It will then skip all the middlewares, and pass the err to the global error ahndling middleware
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
});

// Express would know this is an error handling middle because it has 4 arguments.
app.use(globalErrorHandler);

module.exports = app;
