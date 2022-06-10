const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const User = require("./model/user");
const app = express();

const errorController = require("./controller/error");

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { name } = require("ejs");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("62547461da7a21039af7ae8b")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => {
      console.log("MUR", e);
    });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.show404);

// mongoConnect().then((cl)=>{});

mongoose
  .connect(
    "mongodb+srv://murtazaagaz:12345665@cluster0.th8vy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("MUR APP START");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Murtaza Agaz ",
          email: "murtaza@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((e) => {
    console.log("MUR APP START ERROR", e);
  });
// mongoConnect(() => {
// });

// const instantiateSQL = async () => {
//   Product.belongsTo(User, { constraint: true, onDelete: 'CASCADE' });
//   await sequelize.sync({ force: true });

//   const user = await Users.findByPk(1);
//   if (!user) {
//     await Users.create({ name: `Murtaza`, email: `murtaza@gmail.com` });
//   }
// };
