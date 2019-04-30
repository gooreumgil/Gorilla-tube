import express from "express";
import {
  videoDetail,
  deleteVideo,
  getUpload,
  postUpload,
  getEditVideo,
  postEditVideo
} from "./videoController";
import { uploadVideo, onlyPrivate } from "../../middleware";

const videoRouter = express.Router();

// Upload
videoRouter.get("/upload", onlyPrivate, getUpload);
videoRouter.post("/upload", onlyPrivate, uploadVideo, postUpload);

videoRouter.get("/:id", videoDetail);

// edit
videoRouter.get("/:id/edit", onlyPrivate, getEditVideo);
videoRouter.post("/:id/edit", onlyPrivate, postEditVideo);

videoRouter.get("/:id/deleteVideo", onlyPrivate, deleteVideo);

export default videoRouter;
