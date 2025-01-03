import Router from "express";
import { isAuthenticated } from "./../../middlewares/authenticate.middleare.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  deleteSingleMessage,
  getAllMessagesService,
  getSingleMessageService,
  sendMessageService,
} from "./message.service.js";
import { sendMessageSchema } from "./message.validate.js";
import { validate } from "../../middlewares/validate.middleware.js";
const router = Router();

//send message
router.post(
  "/send-message",
  asyncHandler(isAuthenticated),
  validate(sendMessageSchema),
  asyncHandler(sendMessageService)
);

//get all user's messages ?inbox or ?outbox
router.get(
  "/get-messages",
  asyncHandler(isAuthenticated),
  asyncHandler(getAllMessagesService)
);

//get single message by id in request body
router.get(
  "/single-message/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(getSingleMessageService)
);

//delete single message by its sender only
router.delete(
  "/delete-message/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(deleteSingleMessage)
);
export default router;
