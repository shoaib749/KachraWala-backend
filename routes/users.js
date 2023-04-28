const express = require('express');
const router = express.Router();

const { userRegister} =  require("../controllers/userRegister.js"); 

router.post("/register",userRegister);
module.exports = router;