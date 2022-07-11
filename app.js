const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const User = require("./model/user");
const app = express();

const errorController = require("./controller/error");

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { name } = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGO_DB_URI =
  "mongodb+srv://murtazaagaz:12345665@cluster0.th8vy.mongodb.net/myFirstDatabase";
const store = new MongoDBStore({ uri: MONGO_DB_URI, collection: "session" });

app.use(
  session({
    secret: "My name is Murtaza",
    resave: false,
    store: store,
    saveUninitialized: false,
  })
);

app.use(async (req, res, next) => {
  if (req.session.user) {

    const user = await User.findById(req.session.user._id);

    req.user = user;
  } else {
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(authRoutes);

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.show404);

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("***APP START***");

    app.listen(3000);
  })
  .catch((e) => {
  });
