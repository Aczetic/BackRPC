// build login/sign up form
// create user when sign up
// create a auth middleware for checking whether the user is authorized or not

const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const SIGNATURE = "MYSIGNATURE";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const authMiddleware = (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    req.userEmail = jwt.verify(token, SIGNATURE).email;
    next();
  } else {
    res.redirect("/login"); // when the token is not found redirect to the login page
  }
};

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const data = req.body;

  fs.readdir("./users")
    .then((files) => {
      //
      if (files.indexOf(data.email + ".txt") !== -1) {
        // if the user exists
        fs.readFile(`./users/${data.email}.txt`).then((userData) => {
          if (bcrypt.compareSync(data.password, JSON.parse(userData).hash)) {
            const token = jwt.sign({ email: userData.email }, SIGNATURE);
            res.cookie("token", token); // store the token in cookie
            res.redirect("/home"); // gen hash again using salt stored and password sent through /login and if hash matches then redirect to home
          } else {
            res.send("wrong password go back");
          }
        });
      } else {
        res.redirect("./sign-up"); // if the user does not exists
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("some error occured");
    });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.post("/sign-up", (req, res) => {
  const userData = req.body;
  fs.readdir("./users")
    .then((files) => {
      const salt = bcrypt.genSaltSync(10);
      userData.salt = salt; // include the salt in userData
      return bcrypt.hash(userData.password, salt);
    })
    .then((hash) => {
      fs.writeFile(
        `./users/${userData.email}.txt`,
        JSON.stringify({ ...userData, hash }) // store the user infor with hash
      );
    })
    .then(() => res.redirect("./login")) // to login if the user is found and after creation
    .catch((e) => {
      console.log(e);
      res.send(500).status("Some error occured");
    });
});

app.get("/home", authMiddleware, (req, res) => {
  res.render("home");
});

app.listen(3000, () => console.log("server running at port 3000"));
