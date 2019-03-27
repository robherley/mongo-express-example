const { ObjectId } = require('mongodb');

/**
 * Attempts to convert parameter to an objectid, throws otherwise
 * @param {any} id parameter to convert
 */
function checkObjectId(id) {
  if (!(id instanceof ObjectId)) {
    try {
      if (typeof id === 'undefined') throw 'Specifed Id is undefined';
      id = ObjectId(id);
    } catch (e) {
      throw 'Unable to parse ObjectId';
    }
  }
  return id;
}

module.exports = {
  checkObjectId
};
