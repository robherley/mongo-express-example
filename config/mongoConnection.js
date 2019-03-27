// Src: https://github.com/Stevens-CS546/CS-546/blob/master/Lecture%20Code/lecture_07/intermediate_api/config/mongoConnection.js
const MongoClient = require('mongodb').MongoClient;
const { mongoConfig } = require('./config.json');

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
