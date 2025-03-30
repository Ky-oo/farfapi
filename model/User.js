const { DataTypes, ENUM } = require("sequelize");

const sequelize = require("../orm");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    get() {
      return this.getDataValue("password");
    },
    set(value) {
      this.setDataValue("password", value);
    },
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  firstname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  gender: {
    type: ENUM(["man", "woman"]),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;
