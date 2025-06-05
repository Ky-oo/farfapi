import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
} from "vitest";
import handlePagination from "../routes/utils/pagination";
import { Expense } from "../model";

beforeAll(async () => {
  await Expense.destroy({ where: {} });
});

describe("Pagination", () => {
  it("should return the correct pagination with no expenses", async () => {
    const req = {
      query: {
        pagination: 10,
        pages: 1,
      },
    };
    const pagination = await handlePagination(req, Expense);
    console.log(pagination);
    expect(pagination.limit).toBe(10);
    expect(pagination.offset).toBe(0);
    expect(pagination.totalPages).toBe(1);
  });

  it("should return the correct pagination with expenses", async () => {
    const req = {
      query: {
        pagination: 10,
        pages: 1,
      },
    };

    for (let i = 0; i < 100; i++) {
      await Expense.create({
        name: `Expense ${i}`,
        cost: i * 100,
        date: new Date(),
      });
    }

    const pagination = await handlePagination(req, Expense);
    expect(pagination.limit).toBe(10);
    expect(pagination.offset).toBe(0);
    expect(pagination.totalPages).toBe(10);
  });

  it("should return an error if the page is greater than the total pages", async () => {
    const req = {
      query: {
        pagination: 10,
        pages: 11,
      },
    };
    const pagination = await handlePagination(req, Expense);
    expect(pagination.error).toBe("Page not found, max page is 10");
  });
});
