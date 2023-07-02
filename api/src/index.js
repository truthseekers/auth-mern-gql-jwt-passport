import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { buildContext } from "graphql-passport";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default"; // keep these around for now (4/10/23) had issues with graphql playground and "not a function"

import resolvers from "./resolvers/index.mjs";
import { typeDefs } from "./typeDefs.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
dotenv.config();
import { jwtStrategy, passportLocalStrategy } from "./strategies.mjs";

console.log("1 index.");
const app = express();
console.log("2 index.");

const httpServer = http.createServer(app);

console.log("3 index created httpServer"); // **** Do this everywhere. ****
passportLocalStrategy();
jwtStrategy();

const corsOptions = {
  credentials: true,
  // origin: [
  //   "https://music-web-ui-de4epnutdq-wl.a.run.app",
  //   "http://localhost:3000",
  // ],
  origin: "*", // TODO
  // "Access-Control-Allow-Origin": "*",
  // origin: [
  //   "https://studio.apollographql.com",
  //   "http://localhost:3000",
  //   "https://8c6c-23-162-0-117.ngrok.io",
  // ],
};

let plugins = [];
if (process.env.NODE_ENV === "production") {
  console.log("node_env is production");
  plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
} else {
  plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
  console.log("node_env is not production");
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  plugins,
  introspection: true, // TODO comment / remove this line for security in production. Disallows users from playing in graphql explorer
});

const startServer = async () => {
  console.log("1 startServer");
  await server.start();

  app.use(passport.initialize());

  const customLogin = () => {};

  app.use("/", cors(corsOptions), bodyParser.json());

  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
  app.use(
    "/",
    expressMiddleware(server, {
      context: ({ req, res }) => {
        // console.log("1.5 in context");
        // console.log("in context... res: ", res);
        return buildContext({ req, res, customLogin });
      },
    })
  );

  console.log("2 startServer. db_name: ", process.env.DB_NAME);

  await mongoose.connect(
    // enter the password used to connect to mongo in place of process.env.MONGO_PASS
    `mongodb+srv://john:${process.env.MONGO_PASS}@music-app.wixv4kc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    // `mongodb+srv://john:${process.env.MONGO_PASS}@music-app.wixv4kc.mongodb.net/production?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    }
  );
  console.log("3 mongoose connected");

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
};

startServer();
