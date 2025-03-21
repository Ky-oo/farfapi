var express = require("express");
var router = express.Router();
const { Task } = require("../model");
const handlePagination = require("./utils/pagination");

// Route to get all tasks
router.get("/", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Task);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const tasks = await Task.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found" });
    }

    res.status(200).json({ data: tasks, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Route to get a single task by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while retrieving the task", error });
  }
});

// Route to get all tasks by UserId
router.get("/user/:id", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Task);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const { id } = req.params;
    const tasks = await Task.findAll({
      where: { UserId: id },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (!tasks) {
      return res.status(404).json({ error: "No tasks found" });
    }

    res.status(200).json({ data: tasks, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Route to create a new task
router.post("/", async (req, res) => {
  try {
    const { name, description, status, date, UserId, typeTaskId } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newTask = await Task.create({
      name,
      description,
      status,
      date,
      UserId,
      typeTaskId,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while creating the task", error });
  }
});

// Route to update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, date, UserId, typeTaskId } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.name = name;
    task.description = description;
    task.status = status;
    task.date = date;
    task.UserId = UserId || task.UserId;
    task.TypeTaskId = typeTaskId || task.TypeTaskId;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while updating the task", error });
  }
});

// Route to delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.destroy();
    res.status(204).json({ message: "Task successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while deleting the task", error });
  }
});

module.exports = router;
