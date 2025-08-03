const mongoose = require("mongoose");
const joi = require("joi");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const userValidator = joi.object({
  name: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().required(),
});

const User = mongoose.model("User", UserSchema);

module.exports = { User, userValidator };
