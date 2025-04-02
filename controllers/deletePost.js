const db = require("../db/queries");

async function deletePost(req, res) {
  await db.deletePost(req.params.post);
  res.redirect("/");
}

module.exports = { deletePost };
