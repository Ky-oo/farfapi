var express = require("express");
var router = express.Router();
const verifyIsAdmin = require("../middleware/verifyIsAdmin");
const { TypeTasks } = require("../model");
const handlePagination = require("./utils/pagination");

// Route to get all type of tasks
router.get("/", async (req, res) => {
  try {
    const pagination = await handlePagination(req, TypeTasks);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const typeTasks = await TypeTasks.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (typeTasks.length === 0) {
      return res.status(404).json({ error: "No task types found" });
    }

    res
      .status(200)
      .json({ data: typeTasks, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching task types",
      error,
    });
  }
});

// Route to get a single type of task by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ error: "Type task not found" });
    }

    res.status(200).json(typeTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error on rereiving type task",
      error,
    });
  }
});

// Route to create a new type of task
router.post("/", verifyIsAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing informations" });
    }

    const newTypeTask = await TypeTasks.create({ name });
    res.status(201).json(newTypeTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error at the creation of the task type ", error });
  }
});

// Route to update a type of task by ID
router.put("/:id", verifyIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing informations" });
    }

    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ error: "Type task not found" });
    }

    typeTask.name = name;
    await typeTask.save();

    res.status(200).json(typeTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error at the update of type task",
      error,
    });
  }
});

// Route to delete a type of task by ID
router.delete("/:id", verifyIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ error: "Type task not found" });
    }

    await typeTask.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "",
      error,
    });
  }
});

module.exports = router;
