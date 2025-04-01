const pool = require("./pool");

async function getAllPosts() {
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
}

async function signUp(firstName, lastName, email, pwd) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password, member, admin) values ($1, $2, $3, $4, $5, $6)",
    [firstName, lastName, email, pwd, true, false]
  );
}

async function getUserByEmail(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    username,
  ]);
  return rows[0];
}

async function getUserById(userId) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return rows[0];
}

async function newPost(content, userId) {
  await pool.query("INSERT INTO posts (content, user_id) VALUES ($1, $2)", [
    content,
    userId,
  ]);
}

module.exports = {
  getAllPosts,
  signUp,
  getUserByEmail,
  getUserById,
  newPost,
};
