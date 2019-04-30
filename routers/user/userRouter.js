import express from "express";
import { editProfile, changePassword, userDetail } from "./userController";
import { onlyPrivate } from "../../middleware";

const userRouter = express.Router();

userRouter.get("/editProfile", onlyPrivate, editProfile);
userRouter.get("/changePassword", onlyPrivate, changePassword);
userRouter.get("/:id", userDetail);

export default userRouter;
