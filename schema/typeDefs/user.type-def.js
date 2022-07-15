const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    users: [User!]
    user: User
  }

  input signUpInput {
    name: String!
    email: String!
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type Mutation {
    signup(input: signUpInput): User
    login(input: loginInput): Token
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }
`;
