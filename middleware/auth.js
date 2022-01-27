const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;

const User = require("../models/users");

const mappings = {usernameField: "name", emailField: "email", passwordField: "password"};

const register = async (name, password, next) => {
    try {
        if (!name || !password) {
            throw new Error("User information missing");
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            const user = await User.create({name: name, email: email, passwordHash: passwordHash});
            next(null, user);
        } catch (error) {
            next(error, {});
        }
    } catch (error) {
        next(error);
    }
};

const login = async (email, password, next) => {
    try {
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            return next(null, null, {msg: "Incorrect email address"});
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        return match ? next(null, user) : next(null, null, {msg: "Incorrect password"});
    } catch (error) {
        next(error);
    }
};

const verify = (token, next) => {
    try {
        next(null, token.user);
    } catch (error) {
        next(error);
    }
};

const verifyStrategy = new JWTStrategy({
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token")
}, verify);

const registerStrategy = new LocalStrategy(mappings, register);
const loginStrategy = new LocalStrategy(mappings, login);

module.exports = {
    registerStrategy,
    loginStrategy,
    verifyStrategy
};