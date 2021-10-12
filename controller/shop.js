const Product = require('../model/product');
const Cart = require('../model/cart');
const User = require('../model/user');
exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  console.log('MUR PRODS:: ', products);
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

exports.getProduct = async (req, res, next) => {
  let id = req.params.productId;

  const product = await Product.findById(id);

  console.log('MUR PROD BY ID :: ', product);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product,
    path: '/products',
  });
};
exports.getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();

  // res.json({
  //   result: true,
  //   data: products,
  // });
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
exports.getCart = async (req, res, next) => {

  const products = await req.user.getCart();

  res.render('shop/cart', {
    prods: products,
    pageTitle: 'cart',
    path: '/cart',
    products: products,
  });
};

exports.postCart = async (req, res, next) => {
  let productId = req.body.productId;

  const product = await Product.findById(productId);
  await req.user.addToCart(product); 
    res.redirect('/cart');
};

exports.deleteCart = async (req, res, nex) => {
  const productId = req.body.id;

  await req.user.deleteCartItem(productId);
  res.redirect('/cart');
};
exports.getOrders = async (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/orders', {
      prods: products,
      pageTitle: 'Orders',
      path: '/orders',
    });
  });
};
exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      prods: products,
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  });
};

exports.createOrder = async (req, res, next) => {
  

  await req.user.createOrder();

  res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: ['products'] });
  res.json(orders);
};
