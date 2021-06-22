const db = require('../utils/database').getDb.getDb().collection('users');
const mongoDb = require('mongodb');

class User {
  constructor(username, email, { id }) {
    this.username = username;
    this.email = email;
    this.id = id;
  }

  async save() {
    if (id) {
    }

    return await db.inserOne(this);
  }

  static async findById(id) {
    return await db.find({ _id: new mongoDb.ObjectId(this.id) });
  }
}

module.exports = User;
