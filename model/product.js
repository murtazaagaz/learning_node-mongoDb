const mongoose = require("mongoose");
const schema = mongoose.Schema;
const productSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);

// const getDb = require('../utils/database').getDb;
// const mongoDb = require('mongodb');

// class Product {
//   constructor({ title, description, price, image, id, userId }) {
//     this.title = title;
//     this.description = description;
//     this.price = price;
//     this.image = image;
//     this.id = id;
//     this.userId = userId;

//   }

//   async save() {
//     const db = getDb();
//     if (this.id) {
//       return await db
//         .collection('product')
//         .updateOne({ _id: mongoDb.ObjectId(this.id) }, { $set: this });
//     }

//     return await db.collection('product').insertOne(this);
//   }

//   static async fetchAll() {
//     const db = getDb();

//     return await db.collection('product').find().toArray();
//   }

//   static async findById(prodId) {
//     const db = getDb();
//     return await db
//       .collection('product')
//       .find({ _id: mongoDb.ObjectId(prodId) })
//       .next();
//   }

//   async delete() {
//     return await this.db.deleteOne({ _id: mongoDb.ObjectId(this.id) });
//   }
// }

// module.exports = Product;
