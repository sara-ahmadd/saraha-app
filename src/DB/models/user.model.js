import { model, Schema, Types } from "mongoose";

export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  user: "user",
  admin: "admin",
};

const UserSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    min: [3, "Minimum length is 3 characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  email: {
    type: String,
    unique: [true, "Email must be unique"],
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [6, "Minimum length is 6 characters"],
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: {
      values: Object.values(genders),
      message: "Value must be either `male` or `female`",
    },
    default: genders.male,
  },
  role: {
    type: String,
    enum: {
      values: Object.values(roles),
      message: "Value must be either `user` or `admin`",
    },
    default: roles.user,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = model("user", UserSchema);
