const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema({
  products: [
    {
      type: Object,
      required: true,
    },
  ],

  user: {
    email : { type: String, required: true },
    userId: { type: schema.Types.ObjectId, required: true, ref: "User" },
  },
});

module.exports = mongoose.model("Order", orderSchema);
