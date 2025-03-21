const { DataTypes } = require("sequelize");

const sequelize = require("../orm");

const Subscription = sequelize.define("Subscription", {
  subscriptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endSubscriptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Subscription;
