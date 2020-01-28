"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");

const user = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [32, "username cannot be longer than 32 characters"]
  },
  _id: {
    type: String,
    default: shortid.generate
  }
});

module.exports = mongoose.model("Users", user);
