const Product = require('../model/product');
const Cart = require('../model/cart');
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
  const fetchedCart = await req.user.getCart();

  const products = await fetchedCart.getProducts();

  res.render('shop/cart', {
    prods: products,
    pageTitle: ' cart',
    path: '/cart',
    products: products,
  });
};

exports.postCart = async (req, res, next) => {
  let productId = req.body.productId;

  let fetchedCart = await req.user.getCart();
  if (!fetchedCart) {
    fetchedCart = await req.user.createCart();
  }
  const products = await fetchedCart.getProducts({ where: { id: productId } });

  let quantity = 0;
  const product = products[0];
  if (product) {
    console.log(`MUR CART PROD:: ${product.CartItems}`);
    quantity = product.CartItems.quantity;
  }
  await fetchedCart.addProduct(await Product.findByPk(productId), {
    through: { quantity: quantity + 1 },
  });
  res.redirect('/cart');
};

exports.deleteCart = async (req, res, nex) => {
  const productId = req.body.id;

  const fetchedCart = await req.user.getCart();
  const products = await fetchedCart.getProducts({ where: { id: productId } });
  await products[0].CartItems.destroy();
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
  const cart = await req.user.getCart();

  const products = await cart.getProducts();

  const order = await req.user.createOrder();

  await order.addProducts(
    products.map((product) => {
      product.orderItems = { quantity: product.CartItems.quantity };

      return product;
    })
  );

  res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: ['products'] });
  res.json(orders);
};
