const Task = require("../../config/models/task.model");
const User = require("../../config/models/user.model");
const {
  isAuthenticated,
  isTaskOwner,
} = require("../../middlewares/authentication");
const { combineResolvers } = require("graphql-resolvers");
const { stringToBase64, base64ToString } = require("../../common/utility");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_parent, { cursor, limit = 10 }, { loggedInUserId }) => {
        const query = { user: loggedInUserId };

        if (cursor) {
          query._id = {
            $lt: base64ToString(cursor),
          };
        }

        let result = await Task.find(query)
          .sort({ _id: -1 })
          .limit(limit + 1);

        const hasNextPage = result.length > limit;

        result = hasNextPage ? result.slice(0, -1) : result;
        return {
          taskFeed: result,
          pageInfo: {
            nextPageCursor: hasNextPage
              ? stringToBase64(result[result.length - 1].id)
              : null,
            hasNextPage,
          },
        };
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
    user: combineResolvers(
      isAuthenticated,
      async (parent, _args, { loaders }) => {
        const user = await loaders.user.load(parent.user.toString());
        return user;
      }
    ),
  },
};
