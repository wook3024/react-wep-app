const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
  function (req, res) {}
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/main",
    failureRedirect: "http://localhost:3000/signin",
  })
);

module.exports = router;
