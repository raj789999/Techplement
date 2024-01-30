import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { passwordValidation } from "../middlewares/index.js";

const authRoute = Router();

const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

authRoute.post(
  "/signup",
  [
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Please provide your fullname."),
    body("dateOfBirth")
      .isISO8601()
      .toDate()
      .withMessage("Please provide your birth date."),
    body("email").isEmail().withMessage("Please provide a valid email Id."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Please provide a valid password (min. 8 chars)."),
  ],
  passwordValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Please resolve the errors before moving forward.",
          errors: errors.array(),
        });
      }
      const { fullname, email, password, dateOfBirth } = req.body;

      const isUserExists = await User.findOne({ email });
      if (isUserExists) {
        return res.status(400).json({
          success: false,
          message: "Sorry, a user with this email already exists.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        email,
        fullname,
        dateOfBirth,
        password: passwordHash,
      });

      const data = {
        id: newUser.id,
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.status(200).json({
        success: true,
        message: "Signed up successfully",
        data: {
          token: authToken,
        },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  }
);

authRoute.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email Id."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Please provide a valid password (min. 8 chars)."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Please resolve the errors before moving forward.",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          success: false,
          message: "Please login with correct credentials",
        });
      }

      const data = {
        id: user.id,
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        data: {
          token: authToken,
        },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  }
);

export default authRoute;
