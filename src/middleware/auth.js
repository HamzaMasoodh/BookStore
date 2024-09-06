const jwt = require("jsonwebtoken");
const User = require("../models/user/user");
require('dotenv').config();

const auth = async (req, res, next,isAdminCheck = false) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("Authorization token not provided");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      var decoded = jwt.verify(token, process.env.token_key);

    } catch (e) {
      throw new Error("Token is not Valid")
    }
    const user = await User.findOne({
      _id: decoded?._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("Faild to authenticate");
    }

    if (isAdminCheck && !user.isAdmin) {
      throw new Error("Only admins can perform this action");
    }

  
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    if (e.message.includes('Token')) {
      res.status(401).send({ message: e.message, errMessage: e.message });
    }else{
      res.status(401).send({ message: "Faild to authenticate! Login Again to Continue", errMessage: e.message });
    }
  }
};

const userAuth = async (req, res, next) => {
  return auth(req, res, next);
};

const adminAuth = async (req, res, next) => {
  return auth(req, res, next, true); 
};

module.exports = {userAuth,adminAuth};