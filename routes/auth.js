const express = require("express");
const AuthController = require("../controllers/Auth");

const router = express.Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/user", AuthController.getUser);

module.exports = router;
