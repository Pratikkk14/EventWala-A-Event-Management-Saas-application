const express = require("express");
const router = express.Router();

const { createUser, updateUser, upload } = require("../Controller/DB");
const { profileController, isUserInDB } = require("../Controller/profile");

const authenticate = require("../Middleware/authentication");



router.post("/createuser", createUser);

router.put(
  "/updateuser/:uid",
  authenticate,
  upload.single("avatar"),
  updateUser
);

router.get("/user/:uid", authenticate, profileController);

router.get("/auth-user/:uid", authenticate, isUserInDB);

module.exports = router;