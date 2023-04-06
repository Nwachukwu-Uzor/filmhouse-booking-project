import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import {
  googleClientId,
  googleClientSecret,
  location,
} from "../../config/index.js";
import UserModel from "../models/User.Model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, /**cb */ done) {
      console.log({ profile });
      console.log("here");
      try {
        const existingUser = await UserModel.findOne({ email: profile?.email });

        if (existingUser) {
            cb(null, existingUser)
        }
      } catch (error) {
        cb(error, null)
      }

      //   UserModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });

      //   done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export { passport as passportSetup };
