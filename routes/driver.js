const express = require('express');
const router = express.Router();
const { driverRegister } = require("../controllers/driverRegister.js");
const { driverLogin } = require("../controllers/driverLogin.js");

router.post("/register", driverRegister);
router.post("/login", driverLogin);
module.exports = router;