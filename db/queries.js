const pool = require("./pool");

async function getAllPosts() {
  const { rows } = await pool.query(
    "SELECT posts.user_id, posts.content, posts.post_date, users.first_name, users.last_name FROM posts JOIN users ON users.id = posts.user_id "
  );
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
  await pool.query(
    "INSERT INTO posts (content, user_id, post_date) VALUES ($1, $2, $3)",
    [content, userId, new Date()]
  );
}

module.exports = {
  getAllPosts,
  signUp,
  getUserByEmail,
  getUserById,
  newPost,
};
