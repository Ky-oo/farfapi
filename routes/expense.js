var express = require("express");
var router = express.Router();
const { Expense } = require("../model");

// Route to get a list of all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
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

// Route to create a new expense
router.post("/", async (req, res) => {
  try {
    const { cost, name, date, MonthlyExpenseId, TypeExpenseId, UserId } =
      req.body;

    if (
      !cost ||
      !name ||
      !date ||
      !MonthlyExpenseId ||
      !TypeExpenseId ||
      !UserId
    ) {
      return res.status(400).json({ error: "Missing required information" });
    }

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
      return res.status(400).json({ error: "Missing required information" });
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

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
