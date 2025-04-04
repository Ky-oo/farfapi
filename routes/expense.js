var express = require("express");
var router = express.Router();
const { Expense, MonthlyExpenses } = require("../model");
const handlePagination = require("./utils/pagination");

// Route to get a list of all expenses
router.get("/", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Expense);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const expenses = await Expense.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (expenses.length === 0) {
      return res.status(404).json({ error: "No expenses found" });
    }

    res.status(200).json({ data: expenses, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve expenses" });
  }
});

// Route to get an expense by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

// Route to get all expenses by UserId
router.get("/user/:id", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Expense);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const { id } = req.params;
    const expenses = await Expense.findAll({
      where: { UserId: id },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (!expenses) {
      return res.status(404).json({ error: "No expenses found" });
    }

    res.status(200).json({ data: expenses, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve expenses" });
  }
});

// Route to get all expenses by UserId, year, and month
router.get("/user/:id/:year/:month", async (req, res) => {
  try {
    const { id, year, month } = req.params;

    // Validation des paramètres
    if (!year || !month || isNaN(year) || isNaN(month)) {
      return res.status(400).json({ error: "Invalid year or month" });
    }

    const pagination = await handlePagination(req, Expense);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    let monthlyExpense = await MonthlyExpenses.findOne({
      where: {
        UserId: id,
        year: year,
        month: month,
      },
    });

    if (!monthlyExpense) {
      monthlyExpense = await MonthlyExpenses.create({
        UserId: id,
        year: year,
        month: month,
        max_expense: 0,
      });
    }

    const expenses = await Expense.findAll({
      where: {
        MonthlyExpenseId: MonthlyExpenses.id,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({ error: "No expenses found for this monthly expense" });
    }

    res.status(200).json({ data: expenses, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve expenses" });
  }
});

// Route to create a new expense
router.post("/", async (req, res) => {
  try {
    const { cost, name, date, month, year, TypeExpenseId, UserId } = req.body;

    if (!cost || !name || !date || !month || !year) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    let monthlyExpense = await MonthlyExpenses.findOne({
      where: {
        UserId,
        year,
        month,
      },
    });

    if (!monthlyExpense) {
      monthlyExpense = await MonthlyExpenses.create({
        UserId,
        year,
        month,
        max_expense: 0,
      });
    }

    const MonthlyExpenseId = monthlyExpense.id;

    const newExpense = await Expense.create({
      cost,
      name,
      date,
      MonthlyExpenseId,
      TypeExpenseId,
      UserId,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

// Route to update an expense by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cost, name, date, MonthlyExpenseId, TypeExpenseId, UserId } =
      req.body;

    if (!cost || !name || !date) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const updatedExpense = await Expense.findByPk(id);

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    updatedExpense.cost = cost;
    updatedExpense.name = name;
    updatedExpense.date = date;
    updatedExpense.MonthlyExpenseId =
      MonthlyExpenseId || updatedExpense.MonthlyExpenseId;
    updatedExpense.TypeExpenseId =
      TypeExpenseId || updatedExpense.TypeExpenseId;

    await updatedExpense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// Route to delete an expense by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByPk(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    deletedExpense.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
