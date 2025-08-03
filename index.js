const express = require("express");
const cors = require("cors");
const ProductRoute = require("./routes/product_route");
const UserRoute = require("./routes/user_route");
const connectdb = require("./config/connectdb");
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

connectdb;

server.use("/products", ProductRoute);
server.use("/users", UserRoute);

server.use("/files", express.static(__dirname + "/uploads"));

const PORT = +process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
