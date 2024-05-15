const express = require("express");

const {handleUserSignUP,handleUserLogin} = require("../controllers/user")
 
const router = express.Router();

router.post("/",handleUserSignUP);

router.post("/login",handleUserLogin);

module.exports=router;