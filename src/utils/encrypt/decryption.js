import CryptoJS from "crypto-js";

export const decrypt = ({ cypherText }) => {
  const decryptedText = CryptoJS.AES.decrypt(
    cypherText,
    process.env.CRYPTO_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
