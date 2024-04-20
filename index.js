const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const User = require('../TestingMongoDB/models/User')



const app = express();
require('dotenv').config();
dotenv.config();


// Middleware for session management
app.use(express.json());
app.use(cookieParser());



const  port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@testing.2ubomao.mongodb.net/Testing`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(express.static('public'));

//registartion routes
app.get("/registration", (req,res)  => { 
    res.sendFile(__dirname + "/public/registration.html");
})
//login routes
app.get("/login", (req,res)  => { 
    res.sendFile(__dirname + "/public/login.html");
})
//login routes
app.get("/dashboard", (req,res)  => { 
    res.sendFile(__dirname + "/public/dashboard.html");
})


//handle errors
const handleErrors =(err) => {
    console.log(err.message,err.code);
    let error = {email: '', password: ''};

    //validation errors
    if (err.message.includes('user validation failed')){
        console.log(Object.values(err.errors))
    }
    return error;
}


//auth controller
app.post('/register', async (req, res) => {
    try {
    const { fullname, email, username, password } = req.body;

    const newUser = new User({
        fullname: fullname,
        email: email,
        username: username,
        password: password
    });

    await newUser.save() 
            res.status(201).json(newUser);
}
        catch(err){
           const errors = handleErrors(err);
            console.log("Error!")
            res.status(400).send('error, user not created')
    }});


    
// Express route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find user by username
        const user = await User.findOne({ username });

        // If user not found, redirect to login page with error message
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        // Compare passwords (plaintext)
        if (password === user.password) {
            res.redirect('/dashboard');
        } else {
            // If passwords don't match, redirect to login page with error message
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('An error occurred while logging in');
    }
});


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        // User is authenticated, proceed to the next middleware
        next();
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
};

// Dashboard route (accessible only to authenticated users)
app.get('/dashboard', isAuthenticated, (req, res) => {
    // Render the dashboard page
    res.render('dashboard'); // You may need to change this to match your view setup
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});


// Middleware to check if the user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};
// Protected route for the dashboard
app.get('/dashboard.html', requireAuth, (req, res) => {
    // Render dashboard
});

//cookies
app.get('/set-cookies',(req,res)  =>{

//res.setHeader('Set-cookie','newUser=true');
res.cookie('newUser', false);
res.cookie('isUser', true,{httpOnly: true});
res.send('you got the cookies');

});

app.get('/read-cookies',(req,res)  =>{

    const cookies =req.cookies;
    console.log(cookies.newUser);
    res.json(cookies);

});

app.listen(port, () =>{ 
console.log(`Server is running on port ${port}`);
})