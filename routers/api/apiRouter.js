import express from "express";
import {
  postAddComment,
  postRegisterView,
  postDeleteComment
} from "../video/videoController";

const apiRouter = express.Router();

apiRouter.post("/:id/view", postRegisterView);
apiRouter.post("/:id/comment", postAddComment);
apiRouter.delete("/:id/comment", postDeleteComment);

export default apiRouter;
