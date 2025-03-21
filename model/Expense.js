const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const Expense = sequelize.define("Expense", {
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Expense;
