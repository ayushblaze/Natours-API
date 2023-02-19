const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
}).then(con => {
  console.log("Database connection established!✅");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

const importData = async() => {
  try{
    await Tour.create(tours);
    console.log("Data Loaded!");
  }catch(err){
    console.log("Error from import-dev-data file", err);  
  }
  process.exit();
};

const deleteData = async () => {
  try{
    await Tour.deleteMany();
    console.log("Data Deleted!");
  }catch(err){
    console.log("Error from import-dev-data file", err);  
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

