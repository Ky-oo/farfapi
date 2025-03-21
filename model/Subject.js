const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = Subject;
