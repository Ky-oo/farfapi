var express = require("express");
var path = require("path");

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Load ORM
require("./model");

// Initialize router
var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");
var expenseRouter = require("./routes/expense");
var monthlyExpenseRouter = require("./routes/monthlyExpenses");
var postRouter = require("./routes/post");
var subjectRouter = require("./routes/subject");
var subscriptionRouter = require("./routes/subscription");
var taskRouter = require("./routes/task");
var typeExpenseRouter = require("./routes/typeExpenses");
var typeTaskRouter = require("./routes/typeTask");

// Initialize JWT verification middleware
var verifyToken = require("./middleware/verify_jwt_token");

// Initialize Express app
var app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use("/auth", authRouter);

// Middleware to verify JWT token
app.use(verifyToken);

// Accessible only authenticated
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/monthly_expense", monthlyExpenseRouter);
app.use("/post", postRouter);
app.use("/subject", subjectRouter);
app.use("/subscription", subscriptionRouter);
app.use("/task", taskRouter);
app.use("/type_expense", typeExpenseRouter);
app.use("/type_task", typeTaskRouter);

module.exports = app;
