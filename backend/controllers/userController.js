const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require('../config/generateToken');
const logger = require("../config/logger");

const registerUser = asyncHandler(async(req,res) => {
    const { name, email, password, pic } =req.body;

    if(!name || !email || !password) {
        res.status(400);
        logger.error("enter all required fields")
        throw new Error("Enter all the Required fields");
    }

    const userExists = await User.findOne({ email });
     if(userExists) {
        res.status(400);
        logger.error("User already exists")
        throw new Error("User already exists");
     }

     const user = await User.create({
        name,
        email,
        password,
        pic
     });

     if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
        logger.info("Registration successfull")
     } else {
        res.status(400);
        logger.error("error while registering user")
        throw new Error("Error in creating new User");
     }
});

const authUser = asyncHandler(async(req,res) => {
   const {email,password} = req.body;

   const user = await User.findOne({ email });

   if(user && (await user.matchPassword(password))) {
       res.json({
           _id: user._id,
           name: user.name,
           email: user.email,
           pic: user.pic,
           token: generateToken(user._id)
       });
       logger.info("Login sucessfull")
      
   } else {
       res.status(401);
       logger.error("Invalid Credentials")
       throw new Error("Invalid email or password");
   }
});


const allusers = asyncHandler(async(req,res) => {
    const keyword = req.query.search ? {
      $or: [
          {name : {$regex: req.query.search, $options: "i"}},
          {email : {$regex: req.query.search, $options: "i"}}
  
      ]
    } : {};
    const users = await User.find(keyword).find({_id:{$ne: req.user._id}});
    res.send(users);
    logger.info("user found sucessfully")
  });

module.exports = { registerUser,authUser, allusers}