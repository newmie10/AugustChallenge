import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const clearComments = async () => {
    fetch("http://localhost:4000/clear")

    const res = await fetch("http://localhost:4000/comments");
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetch("http://localhost:4000/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:4000/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment }),
    });
    setComment("");

    const res = await fetch("http://localhost:4000/comments");
    const data = await res.json();
    setComments(data);
  };

  function CommentFrame({ html }) {
    const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 8px; 
              font-family: Arial, sans-serif; 
              color: #c9d1d9; 
              background: #161b22;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    return (
      <iframe
        title="sandbox"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: "100%",
          border: "1px solid #30363d",
          minHeight: "10px",
          marginBottom: "2px",
          borderRadius: "6px"
        }}
        srcDoc={doc}
      />
    );
  }



  return (
    <div className="container">
      <h1>What's on your mind?</h1>
      <p>Leave a comment below. Don't Try Anything! Input is Super Safely Sanitized!</p>

      <form onSubmit={handleSubmit}>
        <input
          name="commentbox"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment..."
        />
        <button type="submit">Post</button>
      </form>

      <h2>All Comments:</h2>
        {comments.map((c, i) => (
          <CommentFrame key={i} html={c} />
        ))}

      <button name="clear" onClick={clearComments}>Clear Comments</button>
    </div>
  );
}

export default App;
