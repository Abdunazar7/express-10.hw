const mongoose = require("mongoose");
const joi = require("joi");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productValidator = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  price: joi.number().min(0).max(1000000).required(),
});

const productUpdateValidator = joi
  .object({
    name: joi.string().optional(),
    image: joi.string().optional(),
    price: joi.number().min(0).max(1000000).optional(),
  })
  .min(1);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product, productValidator, productUpdateValidator };
