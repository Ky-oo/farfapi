var express = require("express");
var router = express.Router();
const { TypeExpenses } = require("../model");
const verifyIsAdmin = require("../middleware/verify_is_admin");

// Route to get all expense types
router.get("/", async (req, res) => {
  try {
    const typeExpenses = await TypeExpenses.findAll();
    res.status(200).json(typeExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving expense types", error });
  }
});

// Route to get a single expense type by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const typeExpense = await TypeExpenses.findByPk(id);

    if (!typeExpense) {
      return res.status(404).json({ message: "Expense type not found" });
    }

    res.status(200).json(typeExpense);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving the expense type", error });
  }
});

// Route to create a new expense type
router.post("/", verifyIsAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const newTypeExpense = await TypeExpenses.create({ name });
    res.status(201).json(newTypeExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating the expense type", error });
  }
});

// Route to update an expense type by ID
router.put("/:id", verifyIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const typeExpense = await TypeExpenses.findByPk(id);

    if (!typeExpense) {
      return res.status(404).json({ message: "Expense type not found" });
    }

    typeExpense.name = name;
    await typeExpense.save();

    res.status(200).json(typeExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the expense type", error });
  }
});

// Route to delete an expense type by ID
router.delete("/:id", verifyIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const typeExpense = await TypeExpenses.findByPk(id);

    if (!typeExpense) {
      return res.status(404).json({ message: "Expense type not found" });
    }

    await typeExpense.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting the expense type", error });
  }
});

module.exports = router;
