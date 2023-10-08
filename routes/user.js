const express = require("express");
const { handleUserSignUp, handleUserLogIn } = require("../controllers/user");

const route = express.Router();

route.post ("/", handleUserSignUp);
route.post("/login", handleUserLogIn);

module.exports = route;