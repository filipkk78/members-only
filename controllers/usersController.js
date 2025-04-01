const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
    .withMessage("Email must be a valid email address"),
  body("password")
    .trim()
    .equals(body("confirmPassword"))
    .withMessage("Passwords must match"),
];

exports.signUp = [
  validateSignUp,
  async (req, res, next) => {
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
