import { model, Schema, Types } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  sender: {
    type: Types.ObjectId,
    required: true,
    ref: "user",
    validate: {
      validator: (value) => Types.ObjectId.isValid(value),
      message: (props) => `${props.value} is not a valid ObjectId.`,
    },
  },
  receiver: {
    type: Types.ObjectId,
    required: true,
    ref: "user",
    validate: {
      validator: (value) => Types.ObjectId.isValid(value),
      message: (props) => `${props.value} is not a valid ObjectId.`,
    },
  },
});
export const MessageModel = model("message", MessageSchema);
