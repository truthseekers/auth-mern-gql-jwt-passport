import mongoose from "mongoose";

const User = mongoose.model("User", {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  refreshToken: String,
});

export { User };
