const User = require("../model/user");
const bycript = require("bcrypt");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "auth/login",
    isLoggedIn: false,
  });
};
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect("/login");
    }
    const isPasswordValid = await bycript.compare(password, user.password);
    if (!isPasswordValid) {
      return res.redirect("/login");
    }
    req.session.isLoggedIn = "true";
    req.session.user = user;
    req.session.save((e) => {
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    return res.redirect("/login");
  }
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    isLoggedIn: false,
  });
};
exports.postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    encryptedPassword = await bycript.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: encryptedPassword,
      cart: { items: [] },
    });
    await user.save();
  } else {
  }
  res.redirect("/login");
};
