import express from "express";
import dbConnection from "./src/DB/connection.js";
import authController from "./src/modules/auth/auth.controller.js";
import userController from "./src/modules/user/user.controller.js";
import messageController from "./src/modules/message/message.controller.js";

const port = process.env.PORT;

const app = express();

await dbConnection();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World! from saraha app :) sara ahmad");
});
app.use("/auth", authController);
app.use("/user", userController);
app.use("/message", messageController);

app.all("*", (req, res) =>
  res.status(404).json({ status: "Error", message: "Endpoint is not found" })
);
//global error handler
app.use((error, req, res, next) => {
  const status = error.cause || 500;
  return res
    .status(status)
    .json({ status: "Error", error: error.message, stack: error.stack });
});
app.listen(port, (req, res) =>
  console.log(`Server is running on port ${port}`)
);
