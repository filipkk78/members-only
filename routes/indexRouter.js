const { Router } = require("express");
const bcrypt = require("bcryptjs");
const indexRouter = Router();
const passport = require("../passportConfig.js");

indexRouter.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

indexRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));

indexRouter.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query("insert into users (username, password) values ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = indexRouter;
