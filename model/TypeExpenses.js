const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const TypeExpenses = sequelize.define("TypeExpenses", {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = TypeExpenses;
