const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const errorController = require('./controller/error');

app.set('view engine', 'ejs');
const mongoConnect = require('./utils/database').mongoConnect;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./model/user');
const { name } = require('ejs');

app.use((req, res, next)=>{
  
  User.findById('61295a2244716780bae60eb8').then((user)=>{
    req.user = new User(user.name, user.email,{id: user._id, cart: user.cart} );
    // console.log('MUR USERNAME '+ user.name);

req.next();
  }).catch((err)=>{
    // console.log('MUR USER ERROR');
  });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);



app.use(errorController.show404);

// mongoConnect().then((cl)=>{});
mongoConnect(() => {
  app.listen(3000);
});

// const instantiateSQL = async () => {
//   Product.belongsTo(User, { constraint: true, onDelete: 'CASCADE' });
//   await sequelize.sync({ force: true });

//   const user = await Users.findByPk(1);
//   if (!user) {
//     await Users.create({ name: `Murtaza`, email: `murtaza@gmail.com` });
//   }
// };
