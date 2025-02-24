const express = require("express");
const router = express();
// const db = require('../common/database')
const authController= require('../controllers/v1/authController')
router.post('/signup',authController.signUp)
router.post('/login',authController.login)
router.get('/getProfile',authController.getProfile)


router.all("*", function (req, res, next) {
    res.send("Invalid Url");
});


module.exports = router;