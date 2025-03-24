var express = require("express");
var router = express.Router();
const { Subscription } = require("../model");
const handlePagination = require("./utils/pagination");

// Route to get all subscriptions
router.get("/", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Subscription);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const subscriptions = await Subscription.findAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (!subscriptions) {
      return res.status(404).json({ error: "No subscriptions found" });
    }

    res
      .status(200)
      .json({ data: subscriptions, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching subscriptions", error });
  }
});

// Route to get a single subscription by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving the subscription", error });
  }
});

// Route to get all subscriptions by UserId
router.get("/user/:id", async (req, res) => {
  try {
    const pagination = await handlePagination(req, Subscription);

    if (pagination.error) {
      return res.status(401).json({ error: pagination.error });
    }

    const { id } = req.params;
    const subscriptions = await Subscription.findAll({
      where: { UserId: id },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    if (!subscriptions) {
      return res.status(404).json({ error: "Subscriptions not found" });
    }

    res
      .status(200)
      .json({ data: subscriptions, totalPages: pagination.totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching subscriptions", error });
  }
});

// Route to create a new subscription
router.post("/", async (req, res) => {
  try {
    const { UserId, subscriptionDate, endSubscriptionDate, isActive } =
      req.body;

    if (!subscriptionDate || !endSubscriptionDate || !isActive) {
      return res.status(400).json({ error: "Required fields are missing" });
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
    res.status(500).json({ error: "Error creating the subscription", error });
  }
});

// Route to update a subscription by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId, subscriptionDate, endSubscriptionDate, isActive } =
      req.body;

    if (!subscriptionDate || !endSubscriptionDate || !isActive) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    subscription.UserId = UserId || subscription.UserId;
    subscription.subscriptionDate = subscriptionDate;
    subscription.endSubscriptionDate = endSubscriptionDate;
    subscription.isActive = isActive;
    await subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating the subscription", error });
  }
});

// Route to delete a subscription by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await subscription.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the subscription", error });
  }
});

module.exports = router;
