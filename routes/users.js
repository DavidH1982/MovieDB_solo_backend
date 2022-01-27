require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const session = {session: false};

const profile = (req, res, next) => {
    res.status(200).json({msg: "Profile: ", user: req.user, token: req.query.secret_token});
};

router.get("/", passport.authenticate("JWT", session), profile);

const register = async (req, res, next) => {
    try {
        req.user.name ? res.status(201).json({msg: "User registered", user: req.user}): res.status(401).json({msg: "User already registered"});
    } catch (error) {
        next(error);
    }
};

router.post("/register", passport.authenticate("register", session), register);

const login = async (req, res, next) => {
    passport.authenticate("login", (error, user) => {
        try {
            if (error) {
                res.status(500).json({msg: "Internal Server Error"});
            } else if (!user) {
                res.status(401).json({msg: "User not authorised"});
            } else {
                const loginFn = (error) => {
                    if (error) {
                        return next(error);
                    } else {
                        const userData = {id: user.id, email: user.email};
                        const data = {user, token: jwt.sign({user: userData}, process.env.SECRET_KEY)};
                        res.status(200).json(data);
                    }
                };
                req.login(user, session, loginFn);
            }
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

router.post("/", login);

router.get("/getallusers", async(req, res) => {
    const allUsers = await User.findAll({
        attributes: ["email", "name"]
    });
    res.status(200).json({msg: "worked", data: allUsers});
});

module.exports = router;