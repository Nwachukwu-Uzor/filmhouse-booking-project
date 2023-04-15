import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import {
  googleClientId,
  googleClientSecret,
  location,
  facebookAppId,
  facebookAppSecret,
  tokenIssuer,
  tokenSecret,
} from "../../config/index.js";
import { UserModel } from "../models/index.js";

passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `/api/auth/google/signup/callback`,
    },
    async function (accessToken, refreshToken, profile, /**done */ cb) {
      try {
        const existingUser = await UserModel.findOne({
          $or: [{ email: profile?._json?.email }, { googleId: profile?.id }],
        });

        if (existingUser) {
          const token = jwt.sign(
            {
              user_id: existingUser._id,
              email: existingUser._doc.email,
              phone: existingUser._doc.phone,
            },
            tokenSecret,
            { issuer: tokenIssuer, expiresIn: "2h" }
          );

          return cb(null, token);
        }
        const newUser = await UserModel.create({
          googleId: profile?.id,
          email: profile?._json?.email,
          emailConfirmed: profile?._json?.email_verified,
          username: profile?._json?.email,
        });

        const token = jwt.sign(
          {
            user_id: newUser._id,
            email: newUser._doc.email,
            phone: newUser._doc.phone,
          },
          tokenSecret,
          { issuer: tokenIssuer, expiresIn: "2h" }
        );

        return cb(null, token);
      } catch (error) {
        cb(error, null);
      }
    }
  )
);

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `/api/auth/google/login/callback`,
    },
    async function (accessToken, refreshToken, profile, /**done */ cb) {
      try {
        const existingUser = await UserModel.findOne({
          $or: [{ email: profile?._json?.email }, { googleId: profile?.id }],
        });

        if (!existingUser) {
          return new Error("No user with this email, please sign up first.");
        }

        if (!existingUser?.googleId.trim().length) {
          existingUser.googleId = profile?.id;
          await existingUser.save();
        }

        const token = jwt.sign(
          {
            user_id: existingUser._id,
            email: existingUser._doc.email,
            phone: existingUser._doc.phone,
          },
          tokenSecret,
          { issuer: tokenIssuer, expiresIn: "2h" }
        );

        return cb(null, token);
      } catch (error) {
        cb(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL: `/api/auth/facebook/callback`,
    },
    async function (accessToken, refreshToken, profile, /**done */ cb) {
      try {
        const existingUser = await UserModel.findOne({
          $or: [{ email: profile?._json?.email }, { googleId: profile?.id }],
        });

        if (existingUser) {
          if (!existingUser?.googleId.trim().length) {
            existingUser.googleId = profile?.id;
            await existingUser.save();
          }
          return cb(null, existingUser);
        }
        const newUser = await UserModel.create({
          googleId: profile?.id,
          email: profile?._json?.email,
          emailConfirmed: profile?._json?.email_verified,
          username: profile?._json?.email,
        });

        return cb(null, newUser);
      } catch (error) {
        cb(error, null);
      }
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
