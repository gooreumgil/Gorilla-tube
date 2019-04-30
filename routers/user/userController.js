import passport from "passport";
import User from "../../models/User";
import { runInNewContext } from "vm";

export const editProfile = (req, res) => {
  res.render("editProfile");
};

export const changePassword = (req, res) => {
  res.render("changePassword");
};

export const userDetail = (req, res) => {
  res.render("userDetail");
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
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/"
});

export const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};