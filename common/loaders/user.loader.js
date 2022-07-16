const User = require("../../config/models/user.model");

module.exports.batchUsers = async (userIds) => {
  const users = await User.find({ _id: userIds });

  return users;
};
