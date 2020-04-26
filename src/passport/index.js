const passport = require("passport");
const LocalStrategy = require("passport-local");
// const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");

const db = require("../models");
const facebookCredencials = require("../config/passport-facebook.json");
console.log("facebookCrerdencials", facebookCredencials);

module.exports = () => {
  passport.serializeUser(async (user, done) => {
    // console.log("serializeUser", user, done);
    done(null, user.username);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { username: id },
      });
      // console.log("deserializeUser", user);
      return done(null, user); // req.user
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await db.User.findOne({ where: { username } });
          if (!user) {
            return done(null, false, {
              message: "😡  Incorrect username.! 😡",
            });
          }
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return done(null, user);
          }
          return done(null, false, { message: "😡  Incorrect password.! 😡" });
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );

  // passport.use(
  //   new FacebookStrategy({facebookCredencials}, function (
  //     accessToken,
  //     refreshToken,
  //     profile,
  //     cb
  //   ) {
  //     console.log("facebook auth", accessToken, refreshToken, profile);
  //     // console.log("profile.emage", profile.emails);
  //     //   User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //     //     return cb(err, user);
  //     //   });
  //   })
  // );
};
