import otpGenerator from "otp-generator";
import { OtpModel } from "../../DB/models/otp.model.js";
import { asyncHandler } from "../asyncHandler.js";
import { eventEmitter } from "./sendEmail.event.js";
import { verificationTemplate } from "./verificationTemplate.js";
import { otpVerificationTemplate } from "./otpVerifyEmail.js";
/**
 * generates new ***otp***
 * @returns {String} new otp
 */
export const createVerificationOtp = () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });

  return otp;
};
/**
 * Sends otp to the input email
 * @param {String} email
 * @returns {void}
 */

export const sendOtp = asyncHandler(async (email) => {
  const otp = createVerificationOtp();
  const otpBody = { email, otp };
  await OtpModel.create(otpBody);
  eventEmitter.emit("sendEmail", email, otpVerificationTemplate(otp));
});
