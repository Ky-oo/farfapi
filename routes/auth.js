const express = require("express");
const router = express.Router();
const { User } = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Function to handle user signup
router.post("/signup", async (req, res) => {
  const { email, password, is_admin, firstname, lastname, gender, city } =
    req.body;
  if (!email || !password || !firstname || !lastname || !gender || !city) {
    res.status(400);
    res.json({
      message:
        "Email, password, firstname, lastname, gender and city are required",
    });
    return;
  }

  if (await User.findOne({ where: { email: email } })) {
    res.status(400);
    res.json({ message: "Email already exists" });
    return;
  }

  // Create the user
  const user = await User.build({
    email: email,
    password: password,
    is_admin: is_admin || false,
    firstname: firstname,
    lastname: lastname,
    gender: gender,
    city: city,
  });

  // validate email field
  try {
    await user.validate({ fields: ["email"] });
  } catch (error) {
    res.status(500);
    res.json({ message: error });
    return;
  }

  // save the user
  try {
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500);
    console.error(error);
    res.json({ message: "Unexpected error" });
    return;
  }

  // send welcome email ()
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: user.email,
    subject: "Bienvenue dans la casserole !",
    text: "Prêt à mettre les 2 pieds dans la plats ?",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    }
  });
});

// Function to handle user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.json({ message: "Email and password are required" });
    return;
  }

  // Find user
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(404);
    res.json({ message: " Invalid email or password" });
    return;
  }

  // Check password
  const passwordOk = await bcrypt.compare(password, user.password);

  try {
    if (!passwordOk) {
      res.status(404).json({ message: "Invalid email or password" });
      return;
    }

    const tokenDuration = "3h";

    // Create token
    try {
      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: tokenDuration,
        }
      );

      res.json({ token, is_admin: user.is_admin });
    } catch (error) {
      console.error("JWT Error:", error);
      res.status(500).json({ message: "Error generating token" });
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
    res.status(500).json({ message: "Error comparing passwords" });
  }
});

module.exports = router;
