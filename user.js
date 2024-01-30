import { Router } from "express";
import { body, validationResult } from "express-validator";
import { allowViewItselfOnly, fetchuser } from "../middlewares/index.js";
import User from "../models/user.js";

const userRoute = Router();

userRoute.put(
  "/update",
  [
    body("fullname").optional().isString().notEmpty(),
    body("dateOfBirth").optional().isISO8601().toDate(),
    body("bio").optional().isString(),
  ],
  fetchuser,
  async (req, res) => {
    const userId = req.user.id;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Please resolve the errors before moving forward.",
          errors: errors.array(),
        });
      }

      if (req.body.email || req.body.password) {
        return res.status(400).json({
          success: false,
          message: "Email and password cannot be updated.",
        });
      }

      const updateFields = {};

      ["fullname", "dateOfBirth", "bio"].forEach((field) => {
        if (req.body[field]) updateFields[field] = req.body[field];
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

userRoute.get(
  "/getById/:userId",
  fetchuser,
  allowViewItselfOnly,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User data fetched successfully.",
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

userRoute.delete("/deleteMe", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User Data has been deleted.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export default userRoute;
