"use strict";

const Users = require("../models/users.js");
const Exercises = require("../models/exercises.js");

exports.createNewUser = async (req, res) => {
  const user = new Users(req.body);

  try {
    await user.save();
    res.json({
      username: user.username,
      _id: user._id
    });
  } catch (e) {
    if (e.code == 11000) {
      res.json({ error: "username already taken" });
    } else {
      res.json({ error: "database error" });
    }
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    res.json(await Users.find({}, "username _id").exec());
  } catch (e) {
    res.json({ error: "database error" });
  }
};

exports.addExercise = async (req, res) => {
  // Validate date imput
  let date;
  if (req.body.date) {
    date = new Date(req.body.date);
    if (!date.getTime()) {
      return res.json({ error: "invalid date input" });
    }
  } else {
    date = new Date();
  }

  try {
    // Check for userId
    const user = await Users.findById(req.body.userId).exec();
    if (!user) {
      return res.json({ error: "no such userId" });
    }

    const exercise = new Exercises({
      username: user.username,
      userId: user._id,
      description: req.body.description,
      duration: req.body.duration,
      date: date
    });
    await exercise.save();
    res.json({
      username: exercise.username,
      userId: exercise.userId,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    });
  } catch (e) {
    res.json({ error: "database error" });
  }
};

exports.getExerciseLog = async (req, res) => {
  // Validate userId
  if (!req.query.userId) {
    return res.json({ error: "userId is required" });
  }

  // Validate dates
  let from, to;
  if (req.query.from) {
    from = new Date(req.query.from);
    if (!from.getTime()) {
      return res.json({ error: "invalid date input" });
    }
  } else {
    from = new Date(0);
  }
  if (req.query.to) {
    to = new Date(req.query.to);
    if (!to.getTime()) {
      return res.json({ error: "invalid date input" });
    }
  } else {
    to = new Date();
  }

  // Validate limit
  let limit;
  if (req.query.limit) {
    limit = Number(req.query.limit);
    if (!limit) {
      return res.json({ error: "invalid limit input" });
    }
  }

  try {
    const user = await Users.findById(req.query.userId).exec();
    if (!user) {
      return res.json({ error: "no such userId" });
    }

    const exercises = await Exercises.find({
      userId: req.query.userId,
      date: { $gt: from, $lt: to }
    })
      .sort("-date")
      .limit(limit)
      .exec();

    res.json({
      username: user.username,
      _id: req.query.userId,
      from: req.query.from ? req.query.from : undefined,
      to: req.query.to ? req.query.to : undefined,
      count: exercises.length,
      log: exercises.map(e => ({
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString()
      }))
    });
  } catch (e) {
    res.json({ error: "database error" });
  }
};
