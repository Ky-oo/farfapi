const Sequelize = require("sequelize");

const sequelizeInstance = new Sequelize(process.env.DB_URI);

module.exports = sequelizeInstance;
