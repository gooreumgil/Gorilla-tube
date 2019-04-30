import express from "express";
import { home, search } from "../video/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout
} from "../user/userController";
import { onlyPublic } from "../../middleware";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);

// join
globalRouter.get("/join", onlyPublic, getJoin);
globalRouter.post("/join", onlyPublic, postJoin, postLogin);

// login
globalRouter.get("/login", onlyPublic, getLogin);
globalRouter.post("/login", onlyPublic, postLogin);

globalRouter.get("/logout", logout);

export default globalRouter;
