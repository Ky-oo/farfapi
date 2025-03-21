var express = require("express");
var router = express.Router();
const { User } = require("../model");

// Route to get a list of all users
router.get("/", async function (req, res) {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get a single user by ID
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to update a user by its ID
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const { email, password, isAdmin, firstname, lastname, gender, city } =
      req.body;

    if (!email || !password || !firstname || !lastname || !gender || !city) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    user.password = password;
    user.isAdmin = isAdmin || false;
    user.firstname = firstname;
    user.lastname = lastname;
    user.gender = gender;
    user.city = city;

    user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete a user by its ID
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
