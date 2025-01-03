import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { genders, UserModel } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import joi from "joi";
import { encrypt } from "../../utils/encrypt/encryption.js";
import { compareHashedText, hashText } from "../../utils/hashing/hashing.js";
import { eventEmitter } from "../../utils/email/sendEmail.event.js";
import { verificationTemplate } from "../../utils/email/verificationTemplate.js";
import { sendEmail } from "../../utils/email/sendEmail.listener.js";
import { resetPasswordTemplate } from "../../utils/email/resetPasswordTemplate.js";

export const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user || user.isDeleted)
    throw new Error("User is not found", { cause: 404 });
  return user;
};

export const signUpService = async (req, res, next) => {
  const { userName, email, phone, password, confirmPassword, gender } =
    req.body;

  //check user is not registered already
  const user = await UserModel.findOne({ email });
  if (user) {
    if (!user.isDeleted) {
      return next(
        new Error("User with this email already exists", { cause: 409 })
      );
    } else {
      //remove soft delete
      user.isDeleted = false;
      //deactivate email until user verfify email
      user.isActivated = false;
      //create activation token
      const activationToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "12h",
      });
      //emit sendEmail event so that the listener function (sendEmail) fires
      eventEmitter.emit(
        "sendEmail",
        email,
        verificationTemplate(activationToken)
      );
      await user.save();
      return res.status(200).json({
        status: "Success",
        message: "Your account is re-activated successfully",
      });
    }
  }

  //hash password
  const hashedPassword = hashText({ plainText: password });

  //encrypt phone number
  const encryptedPhone = encrypt({ plainText: phone });
  //create activation token
  const activationToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "12h",
  });
  //emit sendEmail event so that the listener function (sendEmail) fires
  eventEmitter.emit("sendEmail", email, verificationTemplate(activationToken));
  //add to users collection
  const newUser = await UserModel.create({
    ...req.body,
    password: hashedPassword,
    phone: encryptedPhone,
  });

  return res.status(201).json({
    status: "Success",
    message: "User is created successfully",
  });
};

export const loginService = async (req, res, next) => {
  const { email, password } = req.body;
  //check if user exists
  const user = await getUserByEmail(email);
  //check if user is activated
  if (!user.isActivated)
    return next(new Error("Verify your account to login", { cause: 400 }));
  const isPasswordCorrect = compareHashedText({
    plainText: password,
    hashedValue: user.password,
  });

  if (!isPasswordCorrect)
    return next(new Error("Invalid password.", { cause: 400 }));

  //create access token
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  //log the user in
  user.isLoggedIn = true;
  await user.save();

  return res.status(200).json({
    status: "Success",
    message: "Logged in successfully",
    token: accessToken,
  });
};

export const activateAcountService = async (req, res, next) => {
  const { token } = req.params;
  const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //authenticate the user
  const userEmail = userInfo.email;
  const user = await getUserByEmail(userEmail);

  //change isActivated value of that user to true
  user.isActivated = true;
  await user.save();
  return res
    .status(200)
    .json({ status: "Success", message: "User is activated successfully" });
};

export const forgotPasswordService = async (req, res, next) => {
  //get user email from body
  const { email } = req.body;
  //check if user exists
  await getUserByEmail(email);

  //send email with reset token
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1m",
  });
  //emit sendEmail event so that the listener function (sendEmail) fires
  eventEmitter.emit("sendEmail", email, resetPasswordTemplate(resetToken));
  return res
    .status(200)
    .json({ status: "Success", message: "Reset email is sent successfully" });
};

export const resetPasswordService = async (req, res, next) => {
  //get user reset token from params
  const { token } = req.params;
  //get password from body
  const { password } = req.body;

  const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //authenticate the user
  const userEmail = userInfo.email;
  //check if user exists
  const user = await getUserByEmail(userEmail);
  const hashedPassword = hashText({ plainText: password });
  user.password = hashedPassword;
  //log the user out
  user.isLoggedIn = false;
  //save updated user
  await user.save();
  return res.status(200).json({
    status: "Success",
    message: "Password is reset successfully",
  });
};
