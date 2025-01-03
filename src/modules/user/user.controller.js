import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  changePasswordService,
  deleteAccountService,
  deleteUserAccountForAdmin,
  getAllUsersForAdmin,
  getProfileService,
  getSingleUserForAdmin,
  updateUserProfileService,
  verifyEmailService,
} from "./user.service.js";
import { isAuthenticated } from "../../middlewares/authenticate.middleare.js";
import { changePasswordSchema, profileSchema } from "./user.validate.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getAllMessagesForAdmin,
  getSingleMessageForAdmin,
} from "../message/message.service.js";

const router = Router();

//get user profile
router.get(
  "/profile",
  asyncHandler(isAuthenticated),
  asyncHandler(getProfileService)
);

//update user profile
router.patch(
  "/profile",
  asyncHandler(isAuthenticated),
  validate(profileSchema),
  asyncHandler(updateUserProfileService)
);

//verify user updating his own email
router.get("/verify-email/:token", asyncHandler(verifyEmailService));

//update user password
router.patch(
  "/change-password",
  asyncHandler(isAuthenticated),
  validate(changePasswordSchema),
  asyncHandler(changePasswordService)
);

//delete user account
router.delete(
  "/delete-account",
  asyncHandler(isAuthenticated),
  asyncHandler(deleteAccountService)
);

//Admin : get all messages
router.get(
  "/admin/all-messages",
  asyncHandler(isAuthenticated),
  asyncHandler(getAllMessagesForAdmin)
);
//Admin : get single message
router.get(
  "/admin/single-message/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(getSingleMessageForAdmin)
);

//Admin : get all users
router.get(
  "/admin/all-users",
  asyncHandler(isAuthenticated),
  asyncHandler(getAllUsersForAdmin)
);

//Admin : get single user
router.get(
  "/admin/single-user/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(getSingleUserForAdmin)
);

//Admin : delete single user
router.delete(
  "/admin/delete-user/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(deleteUserAccountForAdmin)
);
export default router;
