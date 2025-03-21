const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const MonthlyExpenses = sequelize.define("MonthlyExpenses", {
  monthName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  max_expense: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = MonthlyExpenses;
