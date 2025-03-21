var express = require("express");
var path = require("path");

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Load ORM
require("./model");

// Initialize routers
var userRouter = require("./routes/user");

// Initialize Express app
var app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use("/user", userRouter);

module.exports = app;
