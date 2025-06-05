import app from "../app";
import { sequelize } from "../model";

export async function setup() {
  await sequelize.drop();

  await sequelize.sync({ force: true });
}

export async function teardown() {
  await sequelize.close();
}
