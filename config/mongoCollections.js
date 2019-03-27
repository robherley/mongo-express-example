// Src: https://github.com/Stevens-CS546/CS-546/blob/master/Lecture%20Code/lecture_07/intermediate_api/config/mongoCollections.js
const dbConnection = require('./mongoConnection');

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  todosCollection: getCollectionFn('todos'),
  usersCollection: getCollectionFn('users')
};
