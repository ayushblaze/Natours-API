const mongoose = require("mongoose");
const dotenv = require("dotenv");
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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name, don't you agree?"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price, right?"],
  }
});

// Creating a model out of the tourSchema
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "Tour",
  price: 500,
});

testTour.save().then(doc => console.log(doc)).catch(err => console.log("Error 🔴", err));

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}📡`);
});