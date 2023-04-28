const express = require('express');
const router = express.Router();

const { userRegister } = require("../controllers/userRegister.js");
const { userLogin } = require("../controllers/userLogin.js");

router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;