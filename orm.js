const { Sequelize } = require("sequelize");

let sequelizeInstance;
if (process.env.NODE_ENV === "test") {
  sequelizeInstance = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
} else {
  sequelizeInstance = new Sequelize(process.env.DB_URI);
}

module.exports = sequelizeInstance;
