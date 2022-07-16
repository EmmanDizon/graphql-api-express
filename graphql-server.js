const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { verifyUser } = require("./helper/context");
const DataLoader = require("dataloader");
const loaders = require("./common/loaders");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  formatError: (error) => {
    return {
      message: error.message,
    };
  },
  context: async ({ req }) => {
    await verifyUser(req);

    return {
      email: req.email,
      loggedInUserId: req.loggedInUserId,
      loaders: {
        user: new DataLoader((keys) => loaders.user.batchUsers(keys)),
      },
    };
  },
});

module.exports = server;
