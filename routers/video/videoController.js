import Video from "../../models/Video";
import Comment from "../../models/Comment";
import User from "../../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  try {
    const {
      query: { term: searchingBy }
    } = req;
    let videos = [];
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    }).sort({ _id: -1 });
    console.log(videos);
    res.render("search", { pageTitle: "Search", searchingBy, videos });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "upload" });
};

export const postUpload = async (req, res) => {
  try {
    const {
      body: { title, description },
      file: { path }
    } = req;

    const newVideo = await Video.create({
      fileUrl: "/" + path,
      title,
      description,
      creator: req.user.id
    });

    req.user.videos.push(newVideo.id);
    req.user.save();
    console.log(req.user.videos);
    res.redirect(`/video/${newVideo.id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/video/upload");
  }
};

export const videoDetail = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const video = await Video.findById(id).populate("creator");

    const comments = await Comment.find({ video: video.id })
      .lean(true)
      .populate("creator");

    const defaultAvatar = "/uploads/avatars/default_avatar.png";
    comments.map(comment => {
      comment.creator.avatarUrl = (comment.creator.avatarUrl || defaultAvatar)
        .split("\\")
        .join("/");

      const date = new Date(comment.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      comment.createdAt = `${year}년` + `${month + 1}월` + `${day}일`;
      return comment;
    });

    // Array.from(comments).map(comment => {
    //   const date = new Date(comment.createdAt);
    //   const year = date.getFullYear();
    //   const month = date.getMonth();
    //   const day = date.getDate();
    //   comment.createdAt = `${year}년` + `${month}월` + `${day}일`;
    //   comment.createdAtDisplay = `${year}년` + `${month}월` + `${day}일`;
    //   console.log(comment.createdAtDisplay);
    //   return comment;
    // });

    res.render("videoDetail", {
      pageTitle: "videoDetail",
      video,
      comments
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const getEditVideo = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;

    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: "editVideo", video });
  } catch (error) {}
};

export const postEditVideo = async (req, res) => {
  try {
    const {
      body: { title, description },
      params: { id }
    } = req;
    await Video.findByIdAndUpdate({ _id: id }, { title, description });
    res.redirect(`/video/${id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    await Video.findOneAndRemove({ _id: id });
    res.redirect("/");
  } catch (error) {
    res.redirect(`/video/${id}/edit`);
    console.log(error);
  }
  // res.render("deleteVideo", { pageTitle: "deleteVideo" });
};

export const postRegisterView = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  try {
    const {
      params: { id },
      body: { text },
      user
    } = req;
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: text,
      creator: user.id,
      video: video.id
    });
    const userComment = await User.findById(req.user.id);
    video.comments.push(newComment.id);
    video.save();
    userComment.comments.push(newComment.id);
    userComment.save();

    const ret = {
      avatarUrl: userComment.avatarUrl,
      name: userComment.name,
      id: newComment.id
    };

    res.send(ret);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const comment = await Comment.findByIdAndRemove(id)
      .lean(true)
      .populate("creator");

    const user = await User.findById(comment.creator._id);

    // 삭제 하기로 전달 받은 id 값을 가진 코멘트를 남기고 나머지 값들을 모음
    user.comments = Array.from(user.comments).filter(comment => {
      return !comment._id.equals(id);
    });

    user.save();

    const video = await Video.findById(comment.video._id);

    video.comments = Array.from(video.comments).filter(comment => {
      return !comment._id.equals(id);
    });

    video.save();

    // // const userResult = user.comments.find(result => result.comment.id === id);
    // const commentArray = comment.creator.comments;
    // const found = commentArray.find(function(element) {
    //   return element == id;
    // });
    // const idx = commentArray.indexOf(found);
    // if (idx > -1) {
    //   console.log("idx!!!!!!", idx);
    //   commentArray.splice(idx, 1);
    // }

    // console.log(commentArray);
    // console.log(found);

    // const video = await Video

    // user.comments.
    res.status(200);
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};
