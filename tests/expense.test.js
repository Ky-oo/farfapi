import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
} from "vitest";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { User, Expense, MonthlyExpenses, TypeExpenses } from "../model";
import rewiremock from "rewiremock/node";
import path from "path";

let app;

beforeAll(async () => {
  const user = await User.create({
    email: "test@test.com",
    password: "password",
    firstname: "Test",
    lastname: "User",
    gender: "man",
    city: "Test City",
    isAdmin: false,
  });

  const mockedVerifyToken = (req, res, next) => {
    req.user_id = user.id;
    next();
  };

  const middlewarePath = path.resolve(
    __dirname,
    "../middleware/verifyJwtToken"
  );
  app = rewiremock.proxy(path.resolve(__dirname, "../app.js"), {
    [middlewarePath]: mockedVerifyToken,
  });
  rewiremock.enable();
});

afterEach(async () => {
  await Expense.destroy({ where: {} });
  await MonthlyExpenses.destroy({ where: {} });
});

describe("Expense", () => {
  let expenses;
  beforeEach(async () => {
    expenses = [];
    for (let i = 0; i < 10; i++) {
      const expense = await Expense.create({
        name: `Expense ${i}`,
        cost: i * 100,
        date: faker.date.past(),
        UserId: 1,
      });
      expenses.push(expense);
    }
  });

  it("should return all expenses", async () => {
    const response = await request(app).get(`/expense`);
    expect(response.body.data.length).toBe(10);
  });

  it("should return an error if no expenses are found", async () => {
    await Expense.destroy({ where: {} });
    const response = await request(app).get(`/expense`);
    expect(response.body.error).toBe("No expenses found");
  });

  it("should return an expense by user", async () => {
    const response = await request(app).get(`/expense/user/1`);
    console.log(response.body);
    expect(response.body.data.length).toBe(10);
  });

  it("should return an expense by id", async () => {
    const response = await request(app).get(`/expense/${expenses[0].id}`);
    expect(response.body.id).toBe(expenses[0].id);
  });

  it("should return an expense by user and month", async () => {
    const monthlyExpense = await MonthlyExpenses.create({
      month: 1,
      year: 2024,
      max_expense: 1000,
      UserId: 1,
    });

    const expense = await Expense.create({
      name: "Expense 1",
      cost: 100,
      date: new Date("2024-01-01"),
      UserId: 1,
      MonthlyExpenseId: monthlyExpense.id,
    });

    const response = await request(app).get(`/expense/user/1/1/2024`);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({
        id: expense.id,
        name: expense.name,
        cost: expense.cost,
      })
    );
  });

  it("should return an error if the month is invalid", async () => {
    const response = await request(app).get(`/expense/user/1/a3/2024`);
    expect(response.body.error).toBe("Invalid year or month");
  });

  it("should return an error if the year is invalid", async () => {
    const response = await request(app).get(`/expense/user/1/1/202a5`);
    expect(response.body.error).toBe("Invalid year or month");
  });

  it("should create an expense", async () => {
    const monthlyExpense = await MonthlyExpenses.create({
      month: 1,
      year: 2024,
      max_expense: 1000,
      UserId: 1,
    });

    const typeExpense = await TypeExpenses.create({
      name: "Test Type Expense",
    });

    const expenseData = {
      name: "Expense 1",
      cost: 100,
      date: new Date("2024-01-01"),
      month: 1,
      year: 2024,
      UserId: 1,
      TypeExpenseId: typeExpense.id,
    };

    const response = await request(app).post(`/expense`).send(expenseData);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: expenseData.name,
      cost: expenseData.cost,
      date: expenseData.date.toISOString(),
      MonthlyExpenseId: monthlyExpense.id,
      TypeExpenseId: typeExpense.id,
      UserId: expenseData.UserId,
    });
  });
});

afterAll(() => {
  rewiremock.disable();
});
