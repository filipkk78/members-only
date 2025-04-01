const { Router } = require("express");
const bcrypt = require("bcryptjs");
const indexRouter = Router();
const passport = require("../passportConfig.js");
const db = require("../db/queries.js");
const { signUp } = require("../controllers/usersController.js");

indexRouter.get("/", (req, res) => {
  const messages = req.session.messages;
  req.session.messages = [];
  res.render("index", { user: req.user, errors: messages });
});

indexRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));

indexRouter.post("/sign-up", signUp);

indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
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
