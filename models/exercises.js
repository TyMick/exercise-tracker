"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exercise = new Schema({
  username: String,
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    max: [32, "description cannot be longer than 32 characters"]
  },
  duration: {
    type: Number,
    required: true,
    min: [1, "duration must be positive"]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Exercises", exercise);
