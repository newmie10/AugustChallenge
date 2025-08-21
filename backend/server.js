const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const FLAG = process.env.FLAG || "CTF{n0w_y0u_h4ck3d_m3}";

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

let comments = [];

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.get("/clear", (req, res) => {
  comments = [];
  res.send("Comments cleared");
})

app.post("/comment", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send("No comment text");

  let newText = [];

  for (let i = 0 ; i < text.length ; i++) {
    let ascii = text.toLowerCase().charCodeAt(i);
    if (ascii >= 59 && ascii <= 63) {
      newText[i] = String.fromCharCode((ascii + 1) % 127);
    }
    else
    {
      newText[i] = text[i];
    }
  }

  const ret = newText.join("")

  comments.push(ret);
  res.send("Comment saved:");
});

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.get("/flag", (req, res) => {
  if (req.cookies.FLAG === FLAG) {
    res.send(`Here is the flag: ${FLAG}`);
  } else {
    res.status(403).send("No flag for you!");
  }
});


app.listen(4000, () => console.log("Backend on port 4000"));

