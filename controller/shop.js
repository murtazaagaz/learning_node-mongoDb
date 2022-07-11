const Product = require("../model/product");
const Cart = require("../model/cart");
const User = require("../model/user");
const Order = require("../model/order");
const order = require("../model/order");

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  // .select("name image price")
  // .populate("userId", "name");
  const isLoggedIn = req.session.isLoggedIn;
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    isLoggedIn: isLoggedIn,
  });
};

exports.getProduct = async (req, res, next) => {
  let id = req.params.productId;

  const isLoggedIn = req.session.isLoggedIn;
  const product = await Product.findById(id);
  const user = req.user;
  res.render("shop/product-detail", {
    product: product,
    pageTitle: product,
    path: "/products",
    isLoggedIn: isLoggedIn,
  });
};
exports.getIndex = async (req, res, next) => {
  const products = await Product.find();

  const isLoggedIn = req.session.isLoggedIn;
  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    isLoggedIn: isLoggedIn,
  });
};
exports.getCart = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items;

  res.render("shop/cart", {
    prods: products,
    pageTitle: "cart",
    path: "/cart",
    products: products,
    isLoggedIn: isLoggedIn,
  });
};

exports.postCart = async (req, res, next) => {
  let productId = req.body.productId;

  const product = await Product.findById(productId);
  await req.user.addToCart(product);
  res.redirect("/cart");
};

exports.deleteCart = async (req, res, nex) => {
  const productId = req.body.id;

  await req.user.removeCartItems(productId);
  res.redirect("/cart");
};
// exports.getOrders = async (req, res, next) => {
//   const orders = Order.find({ "user.userId": req.user._id });

//   res.render("shop/orders", {
//     prods: orders,
//     pageTitle: "Orders",
//     path: "/orders",
//   });
// };
exports.getCheckout = (req, res, next) => {
  const isLoggedIn = false;

  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
      isLoggedIn: isLoggedIn,
    });
  });
};

exports.createOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items.map((p) => {
    let product = { ...p.productId._doc };
    product.quantity = p.quantity;
    return product;
  });

  const order = new Order({
    products: products,
    user: { name: req.user.name, userId: req.user },
  });
  await order.save();
  await req.user.clearCart();

  res.redirect("/orders");
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({ "user.userId": req.user._id });
  const json = { ...orders._doc };
  console.log(json);

  res.json(orders._doc);
};
