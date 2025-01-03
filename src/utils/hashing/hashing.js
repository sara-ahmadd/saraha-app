import bcrypt from "bcrypt";

export const hashText = ({ plainText }) => {
  const hashedText = bcrypt.hashSync(
    plainText,
    Number(process.env.SALT_ROUNDS)
  );
  return hashedText;
};

export const compareHashedText = ({ plainText, hashedValue }) => {
  const isValid = bcrypt.compareSync(plainText, hashedValue);
  return isValid;
};
