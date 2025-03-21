const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const TypeTasks = sequelize.define("TypeTasks", {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = TypeTasks;
