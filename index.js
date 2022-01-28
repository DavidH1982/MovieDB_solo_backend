require("dotenv").config();

const cors = require("cors");
const express = require("express");
const passport = require("passport");

const connection = require("./connection");
const User = require("./models/users");
const userRouter = require("./routes/users");
const { registerStrategy, loginStrategy, verifyStrategy } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

//http://localhost/user/getallusers - sends request (req)
app.use("/", userRouter);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);

app.listen(process.env.PORT, () => {
    connection.authenticate();
    User.sync({alter: true});
    console.log("App is online");
});


// require("dotenv").config();

// const cors = require("cors");
// const express = require("express");
// const passport = require("passport");

// const connection = require("./connection");
// const User = require("./models/users");
// const userRouter = require("./routes/users");
// const { registerStrategy, loginStrategy, verifyStrategy } = require("./middleware/auth");

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(passport.initialize());
// app.use("/", userRouter);

// passport.use("register", registerStrategy);
// passport.use("login", loginStrategy);
// passport.use(verifyStrategy);

// app.listen(process.env.PORT, () => {
//     connection.authenticate();
//     User.sync({alter: true});
//     console.log("Application is online");
// })

//"prestart": "docker run --rm --name master32-mysql -dp 3306:3306 -v mysql-config:/etc -v mysql-data:/var/lib/mysql mysql/mysql-server:latest && sleep 5",
//"poststart": "docker stop master32-mysql",