import jwt from "jsonwebtoken";
import { resetPasswordTemplate } from "../../utils/email/resetPasswordTemplate.js";
import { eventEmitter } from "../../utils/email/sendEmail.event.js";
import { decrypt } from "../../utils/encrypt/decryption.js";
import { roles, UserModel } from "../../DB/models/user.model.js";
import { encrypt } from "../../utils/encrypt/encryption.js";
import { verifyUpdateEmail } from "../../utils/email/updateemailTemplate.js";
import { compareHashedText, hashText } from "../../utils/hashing/hashing.js";

export const getProfileService = async (req, res, next) => {
  //get user
  const user = req.user;
  const decryptedPhone = decrypt({ cypherText: user.phone });
  delete user.password;
  return res
    .status(200)
    .json({ status: "Success", user: { ...user, phone: decryptedPhone } });
};

export const updateUserProfileService = async (req, res, next) => {
  const { userName, email, phone, gender } = req.body;
  const user = req.user;
  if (email) {
    //send email with reset token
    const resetToken = jwt.sign(
      { email, _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );
    //emit sendEmail event so that the listener function (sendEmail) fires
    eventEmitter.emit(
      "sendEmail",
      user.email,
      verifyUpdateEmail(
        `${process.env.BASE_URL}/user/verify-email/${resetToken}`
      )
    );
  }
  if (phone) {
    const encryptedPhone = encrypt({ plainText: phone });
    user.phone = encryptedPhone;
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    { userName, phone: user.phone, gender },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

  return res.status(200).json({
    status: "Success",
    message: `User is updated successfully.${
      email
        ? ", except email : verify updating your email through the email sent to you now"
        : ""
    }`,
    user: { ...updatedUser, phone: decrypt({ cypherText: updatedUser.phone }) },
  });
};

export const verifyEmailService = async (req, res, next) => {
  const { token } = req.params;
  const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const email = userInfo.email;
  const _id = userInfo._id;
  const user = await UserModel.findById(_id);

  if (!user) return next(new Error("user is not found"));
  user.email = email;
  await user.save();
  return res
    .status(200)
    .json({ status: "success", message: "email is updated successfully" });
};

export const changePasswordService = async (req, res, next) => {
  //get user
  const user = req.user;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  //check if old password is correct
  const isOldPasswordCorrect = compareHashedText({
    plainText: oldPassword,
    hashedValue: user.password,
  });
  if (!isOldPasswordCorrect)
    return next(new Error("Old password is incorrect"));

  const updatedPassword = hashText({ plainText: newPassword });
  //change user password
  await UserModel.findByIdAndUpdate(user._id, {
    password: updatedPassword,
    isLoggedIn: false, //log user out
  });

  return res
    .status(200)
    .json({ status: "Success", message: "Password is updated successfully" });
};

export const deleteAccountService = async (req, res, next) => {
  const user = req.user;

  await UserModel.findByIdAndUpdate(user._id, { isDeleted: true });

  return res
    .status(200)
    .json({ status: "Success", message: "User is deleted successfully" });
};

export const getAllUsersForAdmin = async (req, res, next) => {
  const user = req.user;
  if (user.role !== roles.admin)
    return next(
      new Error("You are not authorized to get all users", { cause: 401 })
    );
  const users = await UserModel.find().lean().select("-password");
  return res.status(200).json({
    status: "success",
    users: users.map((user) => ({
      ...user,
      phone: decrypt({ cypherText: user.phone }),
    })),
  });
};

export const getSingleUserForAdmin = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  if (user.role !== roles.admin)
    return next(
      new Error("You are not authorized to get this user profile", {
        cause: 401,
      })
    );
  const userProfile = await UserModel.findById(id).lean().select("-password");
  if (!userProfile) return next(new Error("User is not found", { cause: 404 }));
  return res.status(200).json({
    status: "success",
    user: {
      ...userProfile,
      phone: decrypt({ cypherText: userProfile.phone }),
    },
  });
};

export const deleteUserAccountForAdmin = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  if (user.role !== roles.admin) {
    return next(
      new Error("You are not authorized to delete this user", { cause: 401 })
    );
  }
  await UserModel.findByIdAndUpdate(id, { isDeleted: true });

  return res
    .status(200)
    .json({ status: "Success", message: "User is deleted successfully" });
};
