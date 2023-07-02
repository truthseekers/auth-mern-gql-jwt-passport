import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { Mutation } from "./mutations.mjs";
import { Query } from "./queries.mjs";

const resolvers = {
  Upload: GraphQLUpload,
  Query,
  Mutation,
};

export default resolvers;
