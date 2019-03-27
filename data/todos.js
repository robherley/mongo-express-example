const { checkObjectId } = require('./utils');

const {
  usersCollection,
  todosCollection
} = require('../config/mongoCollections');

/**
 * Gets all the todos in the todos collection
 */
async function getAll() {
  const todos = await todosCollection();
  const allTodos = await todos.find().toArray();
  const users = await usersCollection();

  for (let todo of allTodos) {
    // Get the user with the _id matching the creator
    const todoCreator = await users.findOne(
      { _id: todo.creator },
      { projection: { _id: 1, name: 1 } }
    );
    // Overwrite the creator of the user object
    todo.creator = todoCreator;
  }
  return allTodos;
}

/**
 * Gets a todo document by a specified id, with their creator field populated
 * @param {any} id id of todo to find
 */
async function getById(id) {
  const checkedId = checkObjectId(id);
  const todos = await todosCollection();
  const foundTodo = await todos.findOne({ _id: checkedId });
  if (!foundTodo) throw `Todo (${checkedId}) was not found!`;
  // Get the user with the _id matching the creator field
  const users = await usersCollection();
  const todoCreator = await users.findOne(
    { _id: foundTodo.creator },
    { projection: { _id: 1, name: 1 } }
  );
  // Overwrite the creator of the user object
  foundTodo.creator = todoCreator;
  return foundTodo;
}

/**
 * Creates a todo document with a title and task
 * @param {any} creator objectid of the creator
 * @param {string} title Title of the new todo
 * @param {string} task Task of the new todo
 */
async function create(creator, title, task) {
  const todos = await todosCollection();
  const checkedId = checkObjectId(creator);

  // Check if our creator exists
  const users = await usersCollection();
  const user = await users.findOne({ _id: checkedId });
  if (!user) throw `Specified creator (${checkedId}) does not exist!`;

  // Check our other params
  if (typeof title !== 'string' || typeof task !== 'string')
    throw 'Must specify title and task of type string';

  const result = await todos.insertOne({ creator: checkedId, title, task });
  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#~insertWriteOpCallback
  return result.ops[0];
}

/**
 * Updates a specified todo based on id with either a new title, new task or both
 * @param {any} id id of todo to update
 * @param {string} newTitle new title for the todo
 * @param {string} newTask new task for the todo
 */
async function update(id, newTitle, newTask) {
  const checkedId = checkObjectId(id);
  const replacedFields = {};
  if (typeof newTitle === 'string') {
    replacedFields.title = newTitle;
  }
  if (typeof newTask === 'string') {
    replacedFields.task = newTask;
  }
  if (Object.keys(replacedFields) === 0) {
    throw 'Must specify either newTitle or newTask';
  }
  const todos = await todosCollection();
  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#~findAndModifyWriteOpResult
  const updateResult = await todos.findOneAndUpdate(
    { _id: checkedId },
    { $set: replacedFields },
    { returnOriginal: false }
  );
  if (!updateResult.ok) {
    throw `Mongo was unable to update the todo: ${checkedId}`;
  }
  return updateResult.value;
}

/**
 * Removes a specified todo
 * @param {any} id id of todo to remove
 */
async function remove(id) {
  const checkedId = checkObjectId(id);
  const todos = await todosCollection();
  // Get our todo before we delete it
  const deletedTodo = await getById(checkedId);
  // Delete our todo
  await todos.deleteOne({ _id: checkedId });
  return {
    deleted: true,
    data: deletedTodo
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
