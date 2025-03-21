var express = require("express");
var router = express.Router();
const { Task } = require("../model");

// Route pour récupérer toutes les tâches
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// Route pour récupérer une tâche par ID
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

// Route pour créer une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const { name, description, status, date, UserId, typeTaskId } = req.body;

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

// Route pour mettre à jour une tâche par ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, date, UserId, typeTaskId } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    task.name = name;
    task.description = description;
    task.status = status;
    task.date = date;
    task.UserId = UserId;
    task.TypeTaskId = typeTaskId;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
});

// Route pour supprimer une tâche par ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    await task.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
});

module.exports = router;
