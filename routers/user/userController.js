import passport from "passport";
import User from "../../models/User";

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  try {
    const {
      body: { name, email },
      file
    } = req;
    // console.log("file!!!!!!!!!", file);
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? "/" + file.path : req.user.avatarUrl
    });

    res.redirect("/user/me");
  } catch (error) {
    console.log(error);
    res.redirect("/user/editProfile");
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  try {
    const {
      body: { oldPassword, newPassword, newPassword1 }
    } = req;
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect("/user/changePassword");
      return;
    }

    await req.user.changePassword(oldPassword, newPassword);
    res.redirect("/user/me");
  } catch (error) {
    res.status(400);
    res.redirect("/user/changePassword");
  }
};

export const userDetail = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const user = await User.findById(id).populate("videos");
    console.log("useruseruseruser!!!!!!!!!!!@@@@@", user.id);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      throw Error();
    }

    const user = await User.findById(req.user.id).populate("videos");
    const defaultAvatar = "/uploads/avatars/default_avatar.png";
    user.avatarUrl = user.avatarUrl || defaultAvatar;
    res.render("userDetail", { pageTitle: "My Page", user });
  } catch (error) {}
};

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/join");
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Log In" });
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/"
});

export const githubLogin = passport.authenticate("github", {
  // failureRedirect: "/login",
  // successRedirect: "/"
});

export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  try {
    const {
      _json: { id, avatar_url, name, email }
    } = profile;
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = User.create({
        email,
        name,
        avatarUrl: avatar_url,
        githubId: id
      });
      return cb(null, newUser);
    }
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect("/");
};

export const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
