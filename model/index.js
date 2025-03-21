const sequelize = require("../orm");
const User = require("./User");
const MonthlyExpenses = require("./MonthlyExpenses");
const Expense = require("./Expense");
const TypeExpenses = require("./TypeExpenses");
const Post = require("./Post");
const Subject = require("./Subject");
const Task = require("./Task");
const TypeTasks = require("./TypeTasks");
const Subscription = require("./Subscription");

User.hasMany(MonthlyExpenses);
MonthlyExpenses.belongsTo(User);

MonthlyExpenses.hasMany(Expense);
Expense.belongsTo(MonthlyExpenses);

TypeExpenses.hasMany(Expense);
Expense.belongsTo(TypeExpenses);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

Post.belongsTo(Subject);
Subject.hasMany(Post);

User.hasMany(Task);
Task.belongsTo(User);

Task.belongsTo(TypeTasks);
TypeTasks.hasMany(Task);

User.hasMany(Subscription);
Subscription.belongsTo(User);

sequelize.sync({ alter: true });

module.exports = {
  User,
  MonthlyExpenses,
  Expense,
  TypeExpenses,
  Post,
  Subject,
  Task,
  TypeTasks,
  Subscription,
};
