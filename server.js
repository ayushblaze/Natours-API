const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
}).then(con => {
  console.log("Database connection established!✅");
});

// START THE SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is up on port ${port}📡`);
});

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection Encountered! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});