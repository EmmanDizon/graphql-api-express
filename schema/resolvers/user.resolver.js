const User = require("../../config/models/user.model");
const Task = require("../../config/models/task.model");
const { combineResolvers } = require("graphql-resolvers");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../../middlewares/authentication");

module.exports = {
  Query: {
    users: () => users,
    user: combineResolvers(
      isAuthenticated,
      async (_parent, _args, { email }) => {
        return await User.findOne({ email });
      }
    ),
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { email, password } = input;

      try {
        const user = await User.findOne({ email });
        if (user) throw new Error("Email already in used");

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ ...input, password: hashedPassword });

        return await newUser.save();
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    login: async (_, { input }) => {
      try {
        const { email, password } = input;

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Invalid Password");

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  User: {
    tasks: async ({ id }) => {
      return await Task.find({ user: id });
    },
  },
};
