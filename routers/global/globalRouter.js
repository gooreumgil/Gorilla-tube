import express from "express";
import passport from "passport";
import { home, search } from "../video/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  githubLogin,
  postGithubLogin
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

// github
globalRouter.get("/auth/github", githubLogin);
globalRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "login" }),
  postGithubLogin
);

globalRouter.get("/logout", logout);

export default globalRouter;
