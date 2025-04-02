const { Router } = require("express");
const bcrypt = require("bcryptjs");
const indexRouter = Router();
const passport = require("../passportConfig");
const db = require("../db/queries.js");
const {
  signUp,
  grantMembership,
  grantAdminPrivileges,
} = require("../controllers/usersController");
const { getPosts } = require("../controllers/getPosts");
const { addPost } = require("../controllers/addPost.js");
const { deletePost } = require("../controllers/deletePost.js");

indexRouter.get("/log-in", (req, res) => {
  const messages = req.session.messages;
  req.session.messages = [];
  res.render("log-in.ejs", { user: req.user, errors: messages });
});

indexRouter.get("/get-membership", (req, res) =>
  res.render("get-membership", { user: req.user })
);

indexRouter.post("/get-membership", grantMembership);

indexRouter.get("/get-admin", (req, res) =>
  res.render("get-admin", { user: req.user })
);

indexRouter.post("/get-admin", grantAdminPrivileges);

indexRouter.post("/new", addPost);

indexRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));

indexRouter.post("/sign-up", signUp);

indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
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

indexRouter.post("/delete/:post", deletePost);

indexRouter.get("/", getPosts);

module.exports = indexRouter;
