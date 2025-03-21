var express = require("express");
var router = express.Router();
const { MonthlyExpenses, User } = require("../model");

// Route to get a list of all monthly expenses
router.get("/", async function (req, res) {
  try {
    const monthlyExpenses = await MonthlyExpenses.findAll();
    return res.status(200).json(monthlyExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get a single monthly expense by ID
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const monthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!monthlyExpense) {
      return res.status(404).json({ message: "Monthly expense not found" });
    }

    res.status(200).json(monthlyExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get all monthly expenses by UserId
router.get("/user/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: { model: MonthlyExpenses },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.MonthlyExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get a list of monthly expenses by month and year
router.get("/byMonthYear", async function (req, res) {
  try {
    const { month, year } = req.query;

    const monthlyExpenses = await MonthlyExpenses.findAll({
      where: { month, year },
    });

    res.status(200).json(monthlyExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to create a new monthly expense
router.post("/", async function (req, res) {
  try {
    const { monthName, year, max_expense, UserId } = req.body;

    if (!monthName || !year || !max_expense) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const monthlyExpense = await MonthlyExpenses.create({
      monthName,
      year,
      max_expense,
      UserId,
    });

    res.status(201).json(monthlyExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to update a monthly expense by its ID
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const { monthName, year, max_expense, UserId } = req.body;

    if (!monthName || !year || !max_expense) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const updatedMonthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!updatedMonthlyExpense) {
      return res.status(404).json({ message: "Monthly expense not found" });
    }

    updatedMonthlyExpense.monthName = monthName;
    updatedMonthlyExpense.year = year;
    updatedMonthlyExpense.max_expense = max_expense;
    updatedMonthlyExpense.UserId = UserId || updatedMonthlyExpense.UserId;

    updatedMonthlyExpense.save();

    res.status(200).json(updatedMonthlyExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete a monthly expense by its ID
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const monthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!monthlyExpense) {
      return res.status(404).json({ message: "Monthly expense not found" });
    }

    monthlyExpense.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
