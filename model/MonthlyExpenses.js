const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const MonthlyExpenses = sequelize.define("MonthlyExpenses", {
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_expense: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = MonthlyExpenses;
