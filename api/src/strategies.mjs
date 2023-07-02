import passport from "passport";
import { GraphQLLocalStrategy } from "graphql-passport";
import { Strategy as JWTstrategy } from "passport-jwt"; // is this right?
import { ExtractJwt } from "passport-jwt";
import { User } from "./models/User.mjs";
import bcrypt from "bcrypt";

const passportLocalStrategy = () => {
  return passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      console.log("1 GraphqlLocalStrategy email: ", email);
      console.log("1.5 GraphqlLocalStrategy password: ", password);
      const matchingUser = await User.findOne({ email: email.toLowerCase() });
      // const matchingUser = await User.findOne({
      //   email: { $regex: email, $options: "i" },
      // });
      console.log("2 Graphqllocalstrategy user entered password: ", password);
      console.log("3 Graphqllocalstrategy matchingUser: ", matchingUser);
      console.log("4 Graphqllocalstrategy email: ", email);

      if (!matchingUser) {
        done("Invalid Credentials"); // try catch shouldn't be necessary with this catching invalid creds.
      }

      try {
        console.log("5 Graphqllocalstrategy try");
        let isMatch = await bcrypt.compare(password, matchingUser.password);

        if (isMatch) {
          console.log("6 Graphqllocalstrategy isMatch is true");
          const error = matchingUser ? null : new Error("no matching user");
          done(error, matchingUser);
        } else {
          console.log("7 Graphqllocalstrategy isMatch is false");
          const error = isMatch ? null : new Error("Invalid Credentials");
          done(error, matchingUser);
        }
      } catch (error) {
        console.log("8 Graphqllocalstrategy error: ", error);
        done(error);
      }
    })
  );
};

const jwtStrategy = () => {
  return passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //getJwt,
      },
      async (token, done) => {
        if (token?.user?.email == "tokenerror") {
          let testError = new Error(
            "something bad happened. we've simulated an application error in the JWTstrategy callback for users with an email of 'tokenerror'."
          );
          return done(testError, false);
        }

        if (token?.user?.email == "emptytoken") {
          // 2. Some other reason for user to not exist. pass false as user:
          // displays "unauthorized". Doesn't allow the app to hit the next function in the chain.
          // We are simulating an empty user / no user coming from the JWT.
          return done(null, false); // unauthorized
        }

        // 3. Successfully decoded and validated user:
        // (adds the req.user, req.login, etc... properties to req. Then calls the next function in the chain.)
        // console.log("token in jwt strat: ", token);
        return done(null, token.user);
      }
    )
  );
};
export { jwtStrategy, passportLocalStrategy };
