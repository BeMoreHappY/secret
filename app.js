require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const {Schema} = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema =  new Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})
const User = new mongoose.model("User", userSchema)


app.get("/", function (req, res){
    res.render("home")
})
app.get("/login", function (req, res){
    res.render("login")
})
app.get("/register", function (req, res){
    res.render("register")
})

app.post("/register", function (req, res){
    const email = req.body.username
    const password = req.body.password
    const user = new User({
        email: email,
        password: password
    })
    user.save().then(r => {console.log(r); res.render("secrets")}).catch(err => console.log(err))
})

app.post("/login", async function (req, res) {
    const email = req.body.username
    const password = req.body.password
    await User.findOne({email: email}).then(ret => {
        if (ret != null){
            if (ret.password === password){
                res.render("secrets")
            }
        } else {
            res.send("Nie ma w bazie takiego uzytkownika")
        }
    })
})
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});

