const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name, don't you agree?"],
    unique: true,
    trim: true, 
    maxLength: [40, "A tour must have less than or equal to 40 characters"],
    minLength: [10, "A tour must be more than or equal to 10 characters"],
  },
  slug: String,
  duration: {
    type: Number, 
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty can only be: easy, medium or difficult",
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must me above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price, right?"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual Property
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: only runs before .save() and .create() 
tourSchema.pre("save", function(next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// POST middlewares are executed only when all the pre middlewares are completed,
// they also have access to the doc that was just saved
tourSchema.post("save", function(doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE 
// This middleware would run before running any find query.
// The "this" keyword would now point at the current query and not the current doc
// tourSchema.pre("find", function(next) {
  tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// Creating a model out of the tourSchema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;