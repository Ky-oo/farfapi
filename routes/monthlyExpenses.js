var express = require("express");
var router = express.Router();
const { MonthlyExpenses, User } = require("../model");
const handlePagination = require("./utils/pagination");

// Route to get a list of all monthly expenses
router.get("/", async function (req, res) {
  try {
    const pagination = await handlePagination(req, MonthlyExpenses);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const monthlyExpenses = await MonthlyExpenses.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (monthlyExpenses.length === 0) {
      return res.status(404).json({ error: "No monthly expenses found" });
    }

    return res
      .status(200)
      .json({ data: monthlyExpenses, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

// Route to get a single monthly expense by ID
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const monthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!monthlyExpense) {
      return res.status(404).json({ error: "Monthly expense not found" });
    }

    res.status(200).json(monthlyExpense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
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
      return res.status(404).json({ error: "User not found" });
    }

    if (user.MonthlyExpenses.length === 0) {
      return res
        .status(404)
        .json({ error: "No monthly expenses found for this user" });
    }

    res.status(200).json(user.MonthlyExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

// Route to get a list of monthly expenses by month and year
router.get("/byMonthYear", async function (req, res) {
  try {
    const pagination = await handlePagination(req, MonthlyExpenses);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const { month, year } = req.query;

    const monthlyExpenses = await MonthlyExpenses.findAll({
      where: { month, year },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    res
      .status(200)
      .json({ data: MonthlyExpenses, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

router.get("/user/:id/:month/:year", async function (req, res) {
  try {
    const { id, month, year } = req.params;

    const monthlyExpenses = await MonthlyExpenses.findOne({
      where: { UserId: id, month, year },
    });

    if (!monthlyExpenses) {
      return res.status(404).json({ error: "Monthly expenses not found" });
    }
    res.status(200).json(monthlyExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

// Route to create a new monthly expense
router.post("/", async function (req, res) {
  try {
    const { month, year, max_expense, UserId } = req.body;

    if (!month || !year || !max_expense) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const monthlyExpense = await MonthlyExpenses.findOne({
      where: { month, year, UserId },
    });

    if (!monthlyExpense) {
      monthlyExpense = await MonthlyExpenses.create({
        month,
        year,
        max_expense,
        UserId,
      });
    } else {
      monthlyExpense.max_expense = max_expense;
      monthlyExpense.save();
    }

    res.status(201).json(monthlyExpense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

// Route to update a monthly expense by its ID
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const { month, year, max_expense, UserId } = req.body;

    if (!month || !year || !max_expense) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const updatedMonthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!updatedMonthlyExpense) {
      return res.status(404).json({ error: "Monthly expense not found" });
    }

    updatedMonthlyExpense.month = month;
    updatedMonthlyExpense.year = year;
    updatedMonthlyExpense.max_expense = max_expense;
    updatedMonthlyExpense.UserId = UserId || updatedMonthlyExpense.UserId;

    updatedMonthlyExpense.save();

    res.status(200).json(updatedMonthlyExpense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An An unexpected error occurred",
      error: error.message,
    });
  }
});

// Route to delete a monthly expense by its ID
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const monthlyExpense = await MonthlyExpenses.findByPk(id);

    if (!monthlyExpense) {
      return res.status(404).json({ error: "Monthly expense not found" });
    }

    monthlyExpense.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

module.exports = router;
