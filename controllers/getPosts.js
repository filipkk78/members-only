const db = require("../db/queries");

async function getPosts(req, res) {
  const posts = await db.getAllPosts();
  res.render("index", { posts: posts, user: req.user });
}

module.exports = { getPosts };
