var express = require("express");
var router = express.Router();
const { TypeTasks } = require("../model");

// Route to get all type of tasks
router.get("/", async (req, res) => {
  try {
    const typeTasks = await TypeTasks.findAll();
    res.status(200).json(typeTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des types de tâches",
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
      return res.status(404).json({ message: "Type de tâche non trouvé" });
    }

    res.status(200).json(typeTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération du type de tâche",
      error,
    });
  }
});

// Route to create a new type of task
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Informations manquantes" });
    }

    const newTypeTask = await TypeTasks.create({ name });
    res.status(201).json(newTypeTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création du type de tâche", error });
  }
});

// Route to update a type of task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Informations manquantes" });
    }

    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ message: "Type de tâche non trouvé" });
    }

    typeTask.name = name;
    await typeTask.save();

    res.status(200).json(typeTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du type de tâche",
      error,
    });
  }
});

// Route to delete a type of task by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ message: "Type de tâche non trouvé" });
    }

    await typeTask.destroy();
    res.status(204).json({ message: "Type de tâche supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression du type de tâche",
      error,
    });
  }
});

module.exports = router;
