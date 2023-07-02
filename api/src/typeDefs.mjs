const typeDefs = `
  scalar Upload
  type Query {
    currentUser: User
    users(filter: String): [User!]!
    user(id: ID!): User
  }

  type AuthPayload {
    user: User
    error: String
    accessToken: String
    refreshToken: String
  }

  type Mutation {
    logout: Boolean
    login(email: String!, password: String!): AuthPayload
    signup(firstName: String, lastName: String, email: String!, password: String!): AuthPayload
    token: AuthPayload
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }
`;

export { typeDefs };
