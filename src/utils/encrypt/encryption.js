import CryptoJS from "crypto-js";

export const encrypt = ({ plainText }) => {
  const encryptedText = CryptoJS.AES.encrypt(
    plainText,
    process.env.CRYPTO_SECRET_KEY
  ).toString();
  return encryptedText;
};
