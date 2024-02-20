const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth_middleware");
const profile = require("../../models/Profile_module");

//@route GET /api/profile
//@desc Test Route
//@access Public

router.post("/", auth, (req, res) => {});

router.get("/", auth, (req, res) => {
  const user = req.user.id;
});

module.exports = router;
