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
    username: String,
    password: String
});

// Create user model
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(express.static('public'));

//routes
app.get("/", (req,res)  => { 
    res.sendFile(__dirname + "/pages/index.html");
})

app.post('/register', async (req, res) => {
    try {
    const { username, password } = req.body;

    const newUser = new User({
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


app.listen(port, () =>{ 
console.log(`Server is running on port ${port}`);
})