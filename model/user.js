const getDb = require('../utils/database').getDb
const mongoDb = require('mongodb');

class User {
  constructor(username, email, { id, cart }) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  async save() {

   let db  = getDb().collection("users");
    if (id) {
    }

    

    return await db.insertOne(this);
  }
  async addToCart(product){
    

   const cartItemIndex = this.cart.items.findIndex(cp=>{
     return  cp.productId.toString() === product._id.toString();
    });
     const currentCart  = [...this.cart.items];
  

    
    let quantity = 1;
    if(cartItemIndex>=0){
        quantity = currentCart[cartItemIndex].quantity+1;
        currentCart[cartItemIndex].quantity = quantity;
    } 
    else{
      currentCart.push({productId: product._id, quantity: quantity});
    }

    const db = getDb().collection('users');
    return await db.updateOne({_id: new mongoDb.ObjectId(this._id)},
    {$set: {cart: {items: currentCart}}});
  }

  async getCart() {

    const cartIds = this.cart.items.map(i=> {return  i.productId});
    const productRef = getDb().collection("product");
    var products = await productRef.find({_id: {$in: cartIds}}).toArray();
  
    products = products.map(p => 
       { return {...p, quantity : this.cart.items.find(i=>{
         return p._id.toString() === i.productId.toString();
       }).quantity   
      }} );

      return products;

  }

  async deleteCartItem(productId){
   const  updatedCartItems = this.cart.items.filter(item=>{
      return productId.toString()!== item.productId.toString();
    });
    const db = getDb().collection('users');
    return await db.updateOne({_id: new mongoDb.ObjectId(this._id)},
    {$set: {cart: {items: []}}});

  }

  async createOrder(){
    const db = getDb().collection('orders');
    await db.insertOne({
      items: await this.getCart(),
      user: {_id: this._id,
      name: this.name}
    });
    this.cart.items = [];
    const users = getDb().collection('users');

    await users.updateOne({_id: new mongoDb.ObjectId(this._id)},
    {$set: {cart: {items: currentCart}}});

  }


  static async findById(userId) {
    let db  = getDb().collection("users");

    return await db.findOne({ _id: new mongoDb.ObjectId(userId) });
  }
}

module.exports = User;
