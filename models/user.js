const mongoose = require("mongoose");
const {isEmail} = require("validator")

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");


// Create user schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String, 
        required: [true, 'Please enter an Email'],
        unique: true,
        lowercase:true,
        validate:[isEmail, 'Please enter a Valid email'  ],
    },
    username: {
        type: String, 
        required: [true, 'Please enter an UserName'],
        unique: true,
        lowercase:true
    },
    password:  {
        type: String, 
    required: [true, 'Please enter an Password'],
    minLength: [8, 'Minimum Password Length is 8 characters'],
},
});


// Create user model
const User = mongoose.model('User', userSchema);
module.exports= User;