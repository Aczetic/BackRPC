const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir("./notes", (err, files) => {
    if (!err) {
      res.render("index", {
        notes: files.map((file) => ({
          id: file,
          name: file.substr(36),
        })),
      });
    } else {
      console.log(err);
    }
  });
});

app.post("/create", (req, res) => {
  const { name, data } = req.body;
  fs.writeFile(
    `./notes/${crypto.randomUUID() + name.trim()}.txt`,
    data,
    (err) => {
      if (!err) {
        res.status(200).redirect("/");
      } else {
        console.log(err);
        res.send("note not created");
      }
    }
  );
});

app.get("/read/:id", (req, res) => {
  fs.readFile(`./notes/${req.params.id}.txt`, (err, data) => {
    if (!err) {
      res.render("note", {
        id: req.params.id,
        name: req.params.id.slice(36),
        data: data,
      });
    } else {
      console.log(err);
      res.status(404).send("note not found");
    }
  });
});

app.get("/delete/:id", (req, res) => {
  fs.unlink("./notes/" + req.params.id + ".txt", (err) => {
    if (!err) {
      res.redirect("/");
    } else {
      res.status(505).send("Some error happened");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./notes/" + req.params.id + ".txt", (err, data) => {
    if (!err) {
      res.render("edit", { data, id, name: id.slice(36) });
    } else {
      console.log(err);
    }
  });
});

app.post("/update/:id", (req, res) => {
  console.log(req.body);
  fs.writeFile(
    path.join(__dirname, "/notes/" + req.params.id + ".txt"),
    req.body.data,
    (err) => {
      if (!err) {
        const newName = req.params.id.slice(0, 36) + req.body.name;

        fs.rename(
          path.join(__dirname, "/notes/" + req.params.id + ".txt"),
          path.join(__dirname, "/notes/" + newName + ".txt"),
          (err) => {
            if (!err) {
              res.redirect("/edit/" + newName);
            } else {
              console.log(err);
              res.send("not not renamed");
            }
          }
        );
      } else {
        console.log(err);
        res.send("error");
      }
    }
  );
});

app.listen(3000, () => console.log("listening on 3000"));
