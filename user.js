import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
