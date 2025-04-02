const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateNewPost = [
  body("postContent")
    .isLength({ min: 10, max: 255 })
    .withMessage("Your post must be between 10 and 255 characters long"),
];

exports.addPost = [
  validateNewPost,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.set("Content-Type", "text/html");
      return res.status(400).render("index", {
        errors: errors.array(),
        posts: await db.getAllPosts(),
        user: req.user,
      });
    }
    try {
      const { postContent } = req.body;
      await db.newPost(postContent, req.user.id);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];
