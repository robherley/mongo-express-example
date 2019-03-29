const { checkObjectId } = require('./utils');

const {
  usersCollection,
  todosCollection
} = require('../config/mongoCollections');

/**
 * Gets all the users in the collection as an array, with their todos as a list
 * of { _id, title }
 */
async function getAll() {
  const users = await usersCollection();
  const allUsers = await users.find().toArray();
  const todos = await todosCollection();

  for (let user of allUsers) {
    // Get the todos with the creator matching _id, and only show _id and title
    const userTodos = await todos
      .find({ creator: user._id }, { projection: { _id: 1, title: 1 } })
      .toArray();
    // Add the todos to the user object
    user.todos = userTodos;
  }
  return allUsers;
}

/**
 * Gets a user document by a specified id, with their todos as a list containing
 * todos of { _id, title }
 * @param {any} id id of user to find
 */
async function getById(id) {
  const checkedId = checkObjectId(id);
  const users = await usersCollection();
  const foundUser = await users.findOne({ _id: checkedId });
  if (!foundUser) throw `User (${checkedId}) was not found!`;
  // Get the todos with the creator matching _id, and only show _id and title
  const todos = await todosCollection();
  const userTodos = await todos
    .find({ creator: checkedId }, { projection: { _id: 1, title: 1 } })
    .toArray();
  // Add the todos to the user object
  foundUser.todos = userTodos;
  return foundUser;
}

/**
 * Creates a user document with a name and role
 * @param {string} name Name of the new user
 * @param {string} role Role of the new user
 */
async function create(name, role) {
  const users = await usersCollection();
  if (typeof name !== 'string' || typeof role !== 'string')
    throw 'Must specify name and role of type string';
  const result = await users.insertOne({ name, role });
  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#~insertWriteOpCallback
  return result.ops[0];
}

/**
 * Updates a specified user based on id with either a new name, new role or both
 * @param {any} id id of user to update
 * @param {string} newName new name for the user
 * @param {string} newRole new role for the user
 */
async function update(id, newName, newRole) {
  const checkedId = checkObjectId(id);
  const replacedFields = {};
  if (typeof newName === 'string') {
    replacedFields.name = newName;
  }
  if (typeof newRole === 'string') {
    replacedFields.role = newRole;
  }
  if (Object.keys(replacedFields).length === 0) {
    throw 'Must specify either newName or newRole';
  }
  const users = await usersCollection();
  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#~findAndModifyWriteOpResult
  const updateResult = await users.findOneAndUpdate(
    { _id: checkedId },
    { $set: replacedFields },
    { returnOriginal: false }
  );
  if (!updateResult.ok) {
    throw `Mongo was unable to update the user: ${checkedId}`;
  }
  return updateResult.value;
}

/**
 * Removes a specified user
 * @param {any} id id of user to remove
 */
async function remove(id) {
  const checkedId = checkObjectId(id);
  const users = await usersCollection();
  // Get our user before we delete it
  const deletedUser = await getById(checkedId);
  // Delete our user
  await users.deleteOne({ _id: checkedId });
  const todos = await todosCollection();
  // Find the todos by the creator and delete them
  await todos.deleteMany({ creator: checkedId });
  // Return our deleted user
  return {
    deleted: true,
    data: deletedUser
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
