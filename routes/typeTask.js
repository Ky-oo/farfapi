var express = require("express");
var router = express.Router();
const { TypeTasks } = require("../model");

// Route pour récupérer tous les types de tâches
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

// Route pour récupérer un type de tâche par ID
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

// Route pour créer un nouveau type de tâche
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

// Route pour mettre à jour un type de tâche par ID
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

// Route pour supprimer un type de tâche par ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const typeTask = await TypeTasks.findByPk(id);

    if (!typeTask) {
      return res.status(404).json({ message: "Type de tâche non trouvé" });
    }

    await typeTask.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression du type de tâche",
      error,
    });
  }
});

module.exports = router;
