var express = require("express");
var router = express.Router();
const verifyIsAdmin = require("../middleware/verifyIsAdmin");
const { User } = require("../model");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const handlePagination = require("./utils/pagination");

// Route to get a list of all users
router.get("/", async function (req, res) {
  try {
    const pagination = await handlePagination(req, User);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const users = await User.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return res
      .status(200)
      .json({ data: users, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unexpected error occurred", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Unexpected error occurred", error: error.message });
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

    if (!(await user.validate({ fields: ["email"] }))) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({
      where: { email, id: { [Op.ne]: id } },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.isAdmin = isAdmin || false;
    user.firstname = firstname;
    user.lastname = lastname;
    user.gender = gender;
    user.city = city;

    user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unexpected error occurred", error: error.message });
  }
});

// Route to delete a user by its ID
router.delete("/:id", verifyIsAdmin, async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.destroy();
    res.status(204).json("User deleted");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unexpected error occurred", error: error.message });
  }
});

// Route to give admin rights to a user
router.post("/:id/admin", verifyIsAdmin, async function (req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if ((user.isAdmin = true)) {
      return res.status(403).json({ message: "User already admin" });
    }

    user.isAdmin = true;
    user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unexpected error occurred", error: error.message });
  }
});

module.exports = router;
