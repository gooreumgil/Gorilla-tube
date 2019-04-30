import Video from "../../models/Video";

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
      fileUrl: path,
      title,
      description
    });
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
    const video = await Video.findById(id);
    console.log(video);
    res.render("videoDetail", { pageTitle: "videoDetail", video });
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
    console.log(req.params.id);
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
    console.log(req.params.id);
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
  // res.render("deleteVideo", { pageTitle: "deleteVideo" });
};
