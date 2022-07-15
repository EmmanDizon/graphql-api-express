const Task = require("../../config/models/task.model");
const User = require("../../config/models/user.model");
const {
  isAuthenticated,
  isTaskOwner,
} = require("../../middlewares/authentication");
const { combineResolvers } = require("graphql-resolvers");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_parent, { skip = 0, limit = 10 }, { loggedInUserId }) => {
        const result = await Task.find({ user: loggedInUserId })
          .skip(skip)
          .limit(limit);

        return result;
      }
    ),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_parent, { id }) => {
        return await Task.findOne({ id });
      }
    ),
  },

  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_parent, { input }, { email }) => {
        const user = await User.findOne({ email });

        const task = new Task({ ...input, user: user.id });
        const result = await task.save();

        user.tasks.push(result.id);
        await user.save();

        return result;
      }
    ),

    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_parent, { id, input }) => {
        return await Task.findByIdAndUpdate(id, { ...input }, { new: true });
      }
    ),

    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_parent, { id }, { loggedInUserId }) => {
        const task = await Task.findByIdAndDelete(id);
        await User.updateOne(
          { _id: loggedInUserId },
          {
            $pull: {
              tasks: task.id,
            },
          }
        );

        return task;
      }
    ),
  },

  Task: {
    user: combineResolvers(isAuthenticated, async ({ user }) => {
      return await User.findById(user);
    }),
  },
};
