require("dotenv").config();

const express = require("express");
const passport = require("passport");

const connection = require("./connection");
const User = require("./models/users");
const userRouter = require("./routes/users");
const { registerStrategy, loginStrategy, verifyStrategy } = require("./middleware/auth");

const app = express();

app.use(express.json());

app.use("/", userRouter);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);

app.listen(process.env.PORT, () => {
    connection.authenticate();
    User.sync({alter: true});
    console.log("Application is online");
})