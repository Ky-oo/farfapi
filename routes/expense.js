var express = require("express");
var router = express.Router();
const { Expense } = require("../model");

// Route to get a list of all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Route to create a new expense
router.post("/", async (req, res) => {
  try {
    const { cost, name, date, MonthlyExpenseId, TypeExpenseId, userId } =
      req.body;

    const newExpense = await Expense.create({
      cost,
      name,
      date,
      MonthlyExpenseId,
      TypeExpenseId,
      userId,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to create expense" });
  }
});

// Route to update an expense by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cost, name, date, MonthlyExpenseId, TypeExpenseId, userId } =
      req.body;

    const updatedExpense = await Expense.findById(id);

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    updatedExpense.cost = cost;
    updatedExpense.name = name;
    updatedExpense.date = date;
    updatedExpense.MonthlyExpenseId = MonthlyExpenseId;
    updatedExpense.TypeExpenseId = TypeExpenseId;
    updatedExpense.userId = userId;

    await updatedExpense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// Route to delete an expense by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
