var express = require("express");
var router = express.Router();
const verifyAdmin = require("../middleware/verifyIsAdmin");
const { Post } = require("../model");

// Route to get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving posts", error });
  }
});

// Route to get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving the post", error });
  }
});

// Route to create a new post
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      published,
      publishedAt,
      UserId,
      subjectId,
    } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const newPost = await Post.create({
      title,
      description,
      content,
      published,
      publishedAt,
      UserId,
      subjectId,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating the post", error });
  }
});

// Route to update a post by ID
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      published,
      publishedAt,
      UserId,
      subjectId,
    } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title;
    post.description = description;
    post.content = content;
    post.published = published;
    post.publishedAt = publishedAt;
    post.UserId = UserId || post.UserId;
    post.subjectId = subjectId || post.subjectId;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the post", error });
  }
});

// Route to delete a post by ID
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    res.status(204).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting the post", error });
  }
});

module.exports = router;
