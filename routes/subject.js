var express = require("express");
var router = express.Router();
const { Subject } = require("../model");

// Route to get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving subjects", error });
  }
});

// Route to get a single subject by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving the subject", error });
  }
});

// Route to create a new subject
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newSubject = await Subject.create({
      name,
      description,
    });

    res.status(201).json(newSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating the subject", error });
  }
});

// Route to update a subject by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.name = name;
    subject.description = description;
    await subject.save();

    res.status(200).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the subject", error });
  }
});

// Route to delete a subject by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting the subject", error });
  }
});

module.exports = router;
