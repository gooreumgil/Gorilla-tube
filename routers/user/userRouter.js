import express from "express";
import {
  userDetail,
  getMe,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword
} from "./userController";
import { onlyPrivate, uploadAvatar } from "../../middleware";

const userRouter = express.Router();

// edit profile

userRouter.get("/editProfile", onlyPrivate, getEditProfile);
userRouter.post("/editProfile", onlyPrivate, uploadAvatar, postEditProfile);

userRouter.get("/changePassword", onlyPrivate, getChangePassword);
userRouter.post("/changePassword", onlyPrivate, postChangePassword);

userRouter.get("/me", getMe);
userRouter.get("/:id", userDetail);

export default userRouter;
