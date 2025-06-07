const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("custome routec called");
});

module.exports = router;
