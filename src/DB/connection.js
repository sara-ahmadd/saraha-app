import mongoose from "mongoose";

const uri = process.env.DB_URI;

const dbConnection = async () => {
  await mongoose
    .connect(uri)
    .then(() => console.log(`Connection to DB is successful.`))
    .catch((error) => console.log(`Failed to connect to DB : ${error}`));
};

export default dbConnection;
