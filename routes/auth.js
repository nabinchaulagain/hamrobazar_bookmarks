const express = require("express");
const router = express.Router();
const clearCache = require("../middlewares/clearCache");
const AuthController = require("../controllers/Auth");

router.post("/register", AuthController.register, clearCache());
router.post("/login", AuthController.login);
router.get("/user", AuthController.getUser);

module.exports = router;
