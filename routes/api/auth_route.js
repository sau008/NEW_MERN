const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth_middleware");
const User = require("../../models/User_module");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//@route GET /api/auth
//@desc Test Route
//@access Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

//@route POST /api/auth
//@desc User Authentication
//@access Public

router.post(
  "/",
  [
    check("email", "Please include a vlaid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      //Check if user exist
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "Invalid credentials" });
      }

      //compare the password
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res.status(500).json({ msg: "Something went wrong" });
        }
        if (result) {
          const payload = {
            user: {
              id: user.id,
            },
          };
          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } else {
          return res
            .status(500)
            .json({ msg: "email or password is not valid" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json("server error");
    }
  }
);

module.exports = router;
