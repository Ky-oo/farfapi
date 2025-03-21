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
      return res.status(404).json({ error: "No tasks as been found" });
    }

    res.status(200).json({ data: tasks, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// Route to get a single task by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la tâche", error });
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
      return res.status(404).json({ error: "No tasks as been found" });
    }

    res.status(200).json({ data: tasks, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// Route to create a new task
router.post("/", async (req, res) => {
  try {
    const { name, description, status, date, UserId, typeTaskId } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ message: "Informations manquantes" });
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
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la tâche", error });
  }
});

// Route to update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, date, UserId, typeTaskId } = req.body;

    if (!name || !status || !date) {
      return res.status(400).json({ message: "Informations manquantes" });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
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
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
});

// Route to delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    await task.destroy();
    res.status(204).json({ message: "Tâche supprimée" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
});

module.exports = router;
