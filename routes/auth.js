var express = require("express");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
  "/signup",
  check("name", "name should be atleast 5 charachter long").isLength({
    min: 5,
  }),
  check("email", "email should contain @").isEmail(),
  check("password", "Use special case alphabets").isStrongPassword(),
  signup
);

router.post(
  "/signin",
  check("email", "email should contain @").isEmail(),
  check("password", "Use special case alphabets").isStrongPassword(),
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn,  (req, res) => {
  res.json(req.auth);
});

module.exports = router;
