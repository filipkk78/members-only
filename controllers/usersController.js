const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const validateSignUp = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First name must be alphanumerical")
    .isLength({ max: 50 })
    .withMessage("First name can't be longer than 50 characters"),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name must be alphanumerical")
    .isLength({ max: 50 })
    .withMessage("Last name can't be longer than 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .custom(async (value) => {
      const user = await db.getUserByEmail(value);
      if (user) {
        throw new Error("Email is already taken");
      }
      return true;
    }),
  body("password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];

exports.signUp = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.set("Content-Type", "text/html");
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.signUp(firstName, lastName, email, hashedPassword);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

const validatePasscode = [
  body("passcode")
    .trim()
    .equals(process.env.MEMBERSHIP_PASSCODE)
    .withMessage("Incorrect passcode"),
];

exports.grantMembership = [
  validatePasscode,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.set("Content-Type", "text/html");
      return res.status(400).render("get-membership", {
        errors: errors.array(),
        user: req.user,
      });
    }
    try {
      await db.grantMembership(req.user.email);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];
