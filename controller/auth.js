const User = require("../model/user");
const bycript = require("bcrypt");

const nodeMailer = require("nodemailer");
const sendGridTransporter = require("nodemailer-sendgrid-transport");
const crypt = require("crypto");
const { ObjectId } = require("mongodb");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "auth/login",
    isLoggedIn: false,
    error: req.flash("error"),
  });
};
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    req.flash("error", "Invalid Email Or Password");
    if (!user) {
      return res.redirect("/login");
    }
    const isPasswordValid = await bycript.compare(password, user.password);
    console.log("password: ", isPasswordValid);
    if (!isPasswordValid) {
      return res.redirect("/login");
    }

    req.flash("error", null);
    req.session.isLoggedIn = "true";
    req.session.user = user;
    req.session.save((e) => {
      const transporter = nodeMailer.createTransport(
        sendGridTransporter({
          auth: {
            api_key:
              "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",
          },
        })
      );
      transporter.sendMail({
        to: email,
        subject: "Welcome",
        from: "learningNode@theandroidclassroom.com",
        html: `<p> Hello! Thanks for signing in with us We will be connecting with you in probably 2 bussiness days  </p>`,
      });

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
    error: req.flash("error"),
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
    res.redirect("/login");
  } else {
    req.flash("error", "Email already exists!");
    res.redirect("/signup");
  }
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "auth/reset",
    isLoggedIn: false,
    error: req.flash("error"),
  });
};
exports.postResetPassword = async (req, res, next) => {
  crypt.randomBytes(34, async (err, buffer) => {
    if (err) {
      return res.redirect("/");
    }
    const token = buffer.toString("hex");

    const email = req.body.email;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        req.flash = "Email does not exists";
        return res.redirect("/reset");
      }

      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000;
      await user.save();
      const mailBody = `<P> You requested a password reset
      please click on this <a href="http://localhost:3000/reset/${token}">link </a>to reset password`;
      const transporter = nodeMailer.createTransport(
        sendGridTransporter({
          auth: {
            api_key:
              "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",
          },
        })
      );
      transporter.sendMail({
        to: email,
        subject: "Reset Password",
        from: "learningNode@theandroidclassroom.com",
        html: mailBody,
      });

      res.redirect("/login");
    } catch (e) {
      console.log(e.message);
      return res.redirect("/");
    }
  });
};
exports.getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      res.flash = "Invalid Token";
      return res.redirect("/reset-password");
    }
    res.render("auth/new-password", {
      pageTitle: "Update Passsword",
      path: "/new-password",
      isLoggedIn: false,
      error: req.flash("error"),
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
exports.postNewPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    console.log("New password");
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(401)
        .json({ result: false, message: "User does now exists" });
    }
    const encryptedPassword = await bycript.hash(password, 12);

    user.password = encryptedPassword;
    user.resetToken = "";
    user.resetTokenExpiry = Date.now();
    await user.save();
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
};
