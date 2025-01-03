import EventEmitter from "node:events";
import { sendEmail } from "./sendEmail.listener.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", sendEmail);
