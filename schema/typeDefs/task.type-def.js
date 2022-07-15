const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    tasks: [Task!]
    task(id: ID!): Task
  }

  input createTaskInput {
    name: String!
    completed: Boolean!
  }

  input updateTaskInput {
    name: String
    completed: Boolean
  }

  type Mutation {
    createTask(input: createTaskInput!): Task
    updateTask(id: ID!, input: updateTaskInput!): Task
    deleteTask(id: ID!): Task
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User
  }
`;