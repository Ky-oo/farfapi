var express = require("express");
var router = express.Router();
const { Subscription } = require("../model");

// Route to get all subscriptions
router.get("/", async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving subscriptions", error });
  }
});

// Route to get a single subscription by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving the subscription", error });
  }
});

// Route to create a new subscription
router.post("/", async (req, res) => {
  try {
    const { UserId, subscriptionDate, endSubscriptionDate, isActive } =
      req.body;

    if (!subscriptionDate || !endSubscriptionDate || !isActive) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const newSubscription = await Subscription.create({
      UserId,
      subscriptionDate,
      endSubscriptionDate,
      isActive,
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating the subscription", error });
  }
});

// Route to update a subscription by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId, subscriptionDate, endSubscriptionDate, isActive } =
      req.body;

    if (!subscriptionDate || !endSubscriptionDate || !isActive) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.UserId = UserId || subscription.UserId;
    subscription.subscriptionDate = subscriptionDate;
    subscription.endSubscriptionDate = endSubscriptionDate;
    subscription.isActive = isActive;
    await subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the subscription", error });
  }
});

// Route to delete a subscription by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await subscription.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting the subscription", error });
  }
});

module.exports = router;
