const { gql } = require("apollo-server-express");

const userTypeDefs = require("./user.type-def");
const taskTypeDefs = require("./task.type-def");

module.exports = [userTypeDefs, taskTypeDefs];
