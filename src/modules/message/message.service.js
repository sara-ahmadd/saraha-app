import { Types } from "mongoose";
import { MessageModel } from "../../DB/models/message.model.js";
import { roles, UserModel } from "../../DB/models/user.model.js";
import { decrypt } from "../../utils/encrypt/decryption.js";

export const sendMessageService = async (req, res, next) => {
  const user = req.user;

  const { content, receiverEmail } = req.body;

  //get id of receiver user
  const receiver = await UserModel.findOne({ email: receiverEmail });
  if (!receiver || receiver.isDeleted)
    return next(new Error("Receiver User is not found"));

  await MessageModel.create({
    content,
    sender: new Types.ObjectId(user._id),
    receiver: new Types.ObjectId(receiver._id),
  });
  return res
    .status(201)
    .json({ status: "Success", message: "Message is sent successfully" });
};

export const getAllMessagesService = async (req, res, next) => {
  //get all messages based on id of user even if he is sender or receiver
  const user = req.user;
  const { type } = req.query;

  let messages = [];

  if (type === "inbox") {
    messages = await MessageModel.find({ receiver: user._id })
      .select("content sender receiver")
      .populate([
        { path: "sender", select: "email userName -_id" },
        { path: "receiver", select: "email userName -_id" },
      ]);
  }
  if (type === "outbox") {
    messages = await MessageModel.find({ sender: user._id })
      .select("content sender receiver")
      .populate([
        { path: "sender", select: "email userName -_id" },
        { path: "receiver", select: "email userName -_id" },
      ]);
  }
  return res.status(200).json({ status: "success", messages });
};

export const getSingleMessageService = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const message = await MessageModel.findById(id).populate([
    { path: "sender", select: "email userName" },
    { path: "receiver", select: "email userName" },
  ]);
  if (!message) return next(new Error("Message is not found", { cause: 404 }));
  if (
    user._id.toString() !== message.sender._id.toString() &&
    user._id.toString() !== message.receiver._id.toString()
  ) {
    return next(
      new Error("You're unauthorized to read this message", { cause: 401 })
    );
  }
  return res.status(200).json({ status: "success", message });
};

export const deleteSingleMessage = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const message = await MessageModel.findById(id).populate([
    { path: "sender", select: "email userName" },
    { path: "receiver", select: "email userName" },
  ]);
  if (!message) return next(new Error("Message is not found", { cause: 404 }));
  if (
    user._id.toString() !== message.sender._id.toString() &&
    user.role !== roles.admin
  ) {
    return next(new Error("You cannot delete this message", { cause: 401 }));
  }
  await MessageModel.deleteOne({ _id: message._id });
  return res
    .status(200)
    .json({ status: "success", message: "Message is deleted successfully" });
};

export const getAllMessagesForAdmin = async (req, res, next) => {
  const user = req.user;
  if (user.role !== roles.admin)
    return next(
      new Error("You are not authorized to read all messages", { cause: 401 })
    );
  const messages = await MessageModel.find()
    .select("content sender receiver")
    .populate([{ path: "sender" }, { path: "receiver" }]);

  return res.status(200).json({ status: "success", messages });
};

export const getSingleMessageForAdmin = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  if (user.role !== roles.admin)
    return next(
      new Error("You are not authorized to read this message", { cause: 401 })
    );
  const message = await MessageModel.findById(id)
    .select("content sender receiver")
    .populate([{ path: "sender" }, { path: "receiver" }]);

  return res.status(200).json({ status: "success", message });
};
