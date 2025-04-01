const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const passport = require("./passportConfig.js");
const indexRouter = require("./routes/indexRouter.js");
const pgPool = require("./db/pool.js");
const pgSession = require("connect-pg-simple")(session);

const bcrypt = require("bcryptjs");
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);
app.use(passport.session());

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Members only running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
