const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4000;
const FLAG = process.env.FLAG || "CTF{n0w_y0u_h4ck3d_m3}";

app.use(cookieParser());
app.use(express.json());
app.use(express.static('build'))
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("API on", process.env.PORT || 4000);
});

const users = [];

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.get("/clear/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.comments = []

  res.json(user.comments);
})

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const newUser = {
    id: uuidv4(),
    name: req.body.name || "Anonymous",
    comments: []
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get("/comments/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user.comments);
});

app.post("/comments/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const { comment } = req.body;
  if (!comment) return res.status(400).send("No comment text");

  let newText = [];
  for (let i = 0 ; i < comment.length ; i++) {
    let ascii = comment.toLowerCase().charCodeAt(i);
    if (ascii >= 59 && ascii <= 63) {
      newText[i] = String.fromCharCode((ascii + 1) % 127);
    } else {
      newText[i] = comment[i];
    }
  }
  const ret = newText.join("");
  user.comments.push(ret);
  res.json(user.comments);
});

