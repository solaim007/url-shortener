const express = require("express");
const { URL } = require("../models/url")
const router = express.Router();
router.get("/", async (req, res) => {
    if(!req.user) return res.redirect("/login");
    const allUrls = await URL.find({createdBy: req.user._id}).sort({createdAt:-1}).limit(10);
    return res.render("home", ({
        urls: allUrls,
    }));
});

router.get("/signup",(req,res)=>{
    return res.render("signup")
});

router.get("/login",(req,res)=>{
    return res.render("login");
})
module.exports = router;