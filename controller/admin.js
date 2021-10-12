const Product = require('../model/product');

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  console.log('MUR PRODS:: ', products);
  res.render('admin/products', {
    prods: products,
    pageTitle: 'All Products',
    path: 'admin/products',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
exports.getAddProductsController = (req, res, next) => {
  console.log('Mur GET add products');
  // res.json({ hello: 'helo' });
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};
exports.addProductController = async (req, res, next) => {
  // products.push({ title: req.body.title });

  const title = req.body.title;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;
  // console.log(`MUR ADMIN CREATE USERID: ${req.user.id}`);

  const products = new Product({
    title: title,
    price: price,
    image: image,
    description: description,
    userId : req.user._id,
  });

  const result = await products.save();
  console.log('Mur post add prod', result);

  // await req.user.createProduct({
  //   title: title,
  //   price: price,
  //   image: image,
  //   description: description,
  // });
  // await req.user.createProduct({

  // });

  // res.json({ result: true });
  res.redirect('/products');
};

exports.getEditProductsController = async (req, res, next) => {
  const edit = req.query.edit;

  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (product) {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: product,
    });
  }
};

exports.postEditingController = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;

  const product = new Product({
    id: id,
    title: title,
    price: price,
    description: description,
    image: image,
  });

  await product.save();

  res.redirect('/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const product = new Product({ id: req.body.id });
  await product.delete();

  res.redirect('/products');
};
exports.products = getIndex = (req, res, next) => {
  req.user.getProducts().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
