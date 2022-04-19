"use strict"

const router = require("express").Router();
const userCtrl = require("../controllers/user");
const rate = require('../middleware/limit');

module.exports = (app) => {
    router.post("/signup", userCtrl.signup);
    router.post("/login", rate.limiter, userCtrl.login);
    app.use("/api/user", router);
};