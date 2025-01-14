import { Schema, model } from "mongoose";

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const OtpModel = model("Otp", OtpSchema);
