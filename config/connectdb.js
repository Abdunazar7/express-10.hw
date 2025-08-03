require("dotenv").config();
const mongoose = require("mongoose");
function connectdb() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
}

module.exports = connectdb();
