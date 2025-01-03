import jwt from "jsonwebtoken";
import { UserModel } from "../DB/models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  //get token
  const { authorization } = req.headers;
  if (!authorization) return next(new Error("Token is required"));
  const token = authorization.split(" ")[1]; //to get token without `Bearer` prefix
  if (!token) return next(new Error("Token is invalid"));
  const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //authenticate the user
  const userId = userInfo._id;
  //check user is not registered already
  const user = await UserModel.findById(userId).lean().select("-__v");
  if (!user || user.isDeleted)
    return next(new Error("User is not found", { cause: 404 }));
  //check if user is logged in
  if (!user.isLoggedIn)
    return next(new Error("Login to continue.", { cause: 400 }));

  req.user = user;
  return next();
};
