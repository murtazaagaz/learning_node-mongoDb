const { INET } = require("sequelize/types");
const Product = require("../model/product");

exports.getProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id });
  const isLoggedIn = false;

  res.render("admin/products", {
    prods: products,
    pageTitle: "All",
    path: "admin/products",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    isLoggedIn: isLoggedIn,
  });
};
exports.getAddProductsController = (req, res, next) => {
  const isLoggedIn = false;

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn: isLoggedIn,
  });
};
exports.addProductController = async (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;
  const isLoggedIn = false;

  const products = new Product({
    title: title,
    price: price,
    image: image,
    description: description,
    userId: req.user,
    isLoggedIn: isLoggedIn,
  });

  const result = await products.save();

  res.redirect("/products");
};

exports.getEditProductsController = async (req, res, next) => {
  const edit = req.query.edit;

  const isLoggedIn = false;

  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (product) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      product: product,
      isLoggedIn: isLoggedIn,
    });
  }
};

exports.postEditingController = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;

  const product = await Product.findById(id);
  if (product.userId.toString() !== req.user.userId.toString()) {
    return res.redirect("/");
  }
  product.title = title;
  product.description = description;
  product.image = image;
  product.price = price;

  await product.save();

  res.redirect("/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  await Product.deleteOne({ _id: req.body.id, userId: req.user.userId });

  res.redirect("/");
};
exports.products = getIndex = (req, res, next) => {
  const isLoggedIn = false;

  req.user.getProducts().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Shop",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      isLoggedIn: isLoggedIn,
    });
  });
};
