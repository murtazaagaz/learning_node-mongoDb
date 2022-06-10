const Product = require("../model/product");
const Cart = require("../model/cart");
const User = require("../model/user");
const Order = require("../model/order");
const order = require("../model/order");

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  // .select("name image price")
  // .populate("userId", "name");
  console.log("MUR PRODS:: ", products);
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

exports.getProduct = async (req, res, next) => {
  let id = req.params.productId;

  const product = await Product.findById(id);

  console.log("MUR PROD BY ID :: ", product);
  res.render("shop/product-detail", {
    product: product,
    pageTitle: product,
    path: "/products",
  });
};
exports.getIndex = async (req, res, next) => {
  const products = await Product.find();

  // res.json({
  //   result: true,
  //   data: products,
  // });
  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
exports.getCart = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items;

  // res.send(JSON.stringify(products));
  // return;
  res.render("shop/cart", {
    prods: products,
    pageTitle: "cart",
    path: "/cart",
    products: products,
  });
};

exports.postCart = async (req, res, next) => {
  let productId = req.body.productId;

  console.log("MUR PRODUCT_ID:: ", productId);
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
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

exports.createOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items.map((p) => {
    console.log("order");

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
