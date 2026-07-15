import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log("LOGIN ATTEMPT:", email, password);

      const user = await User.findOne({ email });
      console.log("USER FOUND:", user);

      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("PASSWORD MATCH:", isMatch);

      if (!isMatch) {
        return done(null, false, { message: "Invalid email or password" });
      }

      return done(null, user);
    }
  )
);


export default passport;
