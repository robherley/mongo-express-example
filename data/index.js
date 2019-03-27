const todos = require('./todos');
const users = require('./users');

/* 
  Export both data modules in one file.
    This doesn't change any functionality of your application, but it's good
    practice to group the data into one export, which allows for cleaner code.
*/
module.exports = {
  todos,
  users
};
