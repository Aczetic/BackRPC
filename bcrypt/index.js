const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  const data = { email: "helloworldme@gmail.com" };
  res.cookie("jwt", jwt.sign(data, "signature"));
  res.send();
});

app.get("/read", (req, res) => {
  const data = jwt.verify(req.cookies.jwt, "signature");
  console.log(data);
  res.send("done");
});

app.listen(3000, () => console.log("Listening on port 3000"));
