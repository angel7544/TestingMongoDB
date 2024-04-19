const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");


const app = express();
require('dotenv').config();
dotenv.config();


const  port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@testing.2ubomao.mongodb.net/Testing`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create user schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    username: String,
    password: String,
});

// Create user model
const User = mongoose.model('User', userSchema);

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
            res.redirect('/');
}
        catch(error){
            console.log("Error in registeration")
            res.redirect("error");
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
            res.redirect('/index.html');
        } else {
            // If passwords don't match, redirect to login page with error message
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('An error occurred while logging in');
    }
});



app.listen(port, () =>{ 
console.log(`Server is running on port ${port}`);
})