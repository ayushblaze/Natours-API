const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name, don't you agree?"],
    unique: true,
    trim: true, 
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
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
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

// Creating a model out of the tourSchema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;