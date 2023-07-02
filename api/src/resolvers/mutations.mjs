import { User } from "../models/User.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Mutation = {
  // I'm actually not sure the proper way to logout. Doing a hack right now by just removing localStorage accessToken.
  logout: (parent, args, context) => context.logout(),
  login: async (parent, { email, password }, context) => {
    console.log("1 login: email & password: ", email, password);
    const { user } = await context.authenticate("graphql-local", {
      email,
      password,
    });

    // I don't think try - catch is necessary here. it's more of an "informational" issue so maybe don't even throw an error.
    // if (!user.confirmed) {
    //   return { error: "Confirm your email first!" };
    // }
    // Or I could try catch to deal with the "unhandled promise" but I'm not really trying to do anything.
    // Or this is an informational error and I shouldn't throw an error?

    console.log("user in login returned from graphql-local", user);

    // Fix so we're ONLY sending the ID. a separate query handles all the other stuff because data changes too frequently
    const body = {
      id: user.id,
      email: user.email,
    };
    const accessToken = jwt.sign(
      { user: body },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30000s",
      }
    );

    const refreshToken = await jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "300000s",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    await context.customLogin(user);
    return { user, accessToken: accessToken, refreshToken: refreshToken };
  },
  token: async (parent, args, context) => {
    const refreshToken = context.req.headers.authorization.split("Bearer ")[1];

    try {
      console.log("1 token");
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log("2 token");
      const { email } = payload;
      console.log("3 token. email from payload", email);

      const theUser = await User.findOne({ email });
      console.log("4 token. theUser from db", theUser);

      const refreshTokensMatch = theUser.refreshToken == refreshToken;
      console.log("5 token. refreshTokensMatch", refreshTokensMatch);
      // const body = { id: theUser.id, email: theUser.email };
      const body = {
        id: theUser.id, // get rid of this
        email: theUser.email, // get rid of this
      };
      console.log("6 token. body", body);

      if (refreshTokensMatch) {
        console.log("7 token. refreshTokensMatch true");
        const accessToken = await jwt.sign(
          { user: body },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "300s" }
        );
        console.log("8 token. accessToken: ", accessToken);
        return {
          accessToken: accessToken,
          user: theUser,
        };
        // return accessToken; //{ accessToken: accessToken };
      } else {
        return {
          accessToken: "",
        };
        // return ""; // tokens don't match
      }
    } catch (error) {
      console.log("now returning empty accesstoken");
      return {
        accessToken: "",
      };
    }
  },
  signup: async (
    parent,
    { firstName, lastName, artist = "", email, password, confirm },
    context
  ) => {
    const userWithEmailAlreadyExists = await User.findOne({ email: email });

    if (userWithEmailAlreadyExists) {
      throw new Error("User with email already exists");
    }

    if (password !== confirm) {
      throw new Error("Passwords don't match");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    let paramObj = {
      email: email.toLowerCase(),
      password: hashedPassword,
      confirmed: false,
      promoFrequency: 5,
      nextPromoIn: 5,
      promotionType: "song",
    };

    if (firstName) {
      paramObj.firstName = firstName;
    }
    if (lastName) {
      paramObj.lastName = lastName;
    }
    if (artist) {
      paramObj.artist = artist;
      paramObj.status = "pending";
      paramObj.userType = "artist";
    } else {
      paramObj.userType = "listener";
    }

    user = new User(paramObj);

    await user.save();

    // const emailText = `Please click this link to confirm your email: ${process.env.WEB_UI_URL}/confirmuser/${user.id}`;
    // Sending sendgrid "confirmation" email.
    // const msg = {
    //   to: email, // Change to your recipient
    //   from: "your@email.io", // Change to your verified sender
    //   subject: "[ACTION REQUIRED] Confirm Your Email",
    //   text: emailText,
    //   // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    // };

    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log("Email sent");
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //   });

    const body = { id: user.id, email: user.email, artist: user.artist };

    // I didn't think we were supposed to be "logging in" on signup because the user has to confirm their email.
    // may need to remove this access token and refreshToken
    const accessToken = jwt.sign(
      { user: body },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "300s",
      }
    );

    const refreshToken = await jwt.sign(
      { email: email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "60000000s",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
};

export { Mutation };
