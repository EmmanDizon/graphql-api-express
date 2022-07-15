const { skip } = require("graphql-resolvers");
const Task = require("../config/models/task.model");

module.exports.isAuthenticated = (_parent, _args, { email }) => {
  if (!email) {
    throw new Error("Access Denied. Please login to continue");
  }

  return skip;
};

module.exports.isTaskOwner = async (_parent, { id }, { loggedInUserId }) => {
  const task = await Task.findById(id);
  if (!task || task.user.toString() !== loggedInUserId)
    throw new Error("Task not found with the given ID.");

  return skip;
};
