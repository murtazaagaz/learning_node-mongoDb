// const MongoClient = require('mongodb').MongoClient;

// const uri =
//   'mongodb+srv://murtaza:123456@cluster0.th8vy.mongodb.net/shop?retryWrites=true&w=majority';

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// // client.connect((err) => {
// //   // const collection = client.db('test').collection('devices');
// //   // perform actions on the collection object
// //   client.close();
// // });

// const getDb = () => {
//   const _db = client.db();

//   if (_db) {
//     return _db;
//   } else {
//     throw 'No Db Define';
//   }
// };
// module.exports.client = client;
// exports.getDb = getDb;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    // 'mongodb+srv://murtaza.agaz100@gmail.com:m.123456@cluster0.th8vy.mongodb.net/shop?retryWrites=true&w=majority'
    'mongodb+srv://murtazaagaz:12345665@cluster0.th8vy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
