import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
  async function initUser() {
    let savedId = localStorage.getItem("userId");
    let valid = false;

    if (savedId) {
      const res = await fetch(`/api/comments/${savedId}`);
      if (res.ok) valid = true;
    }

    if (!valid) {
      // old ID invalid or backend restarted — make a new one
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Visitor" }),
      });
      const data = await res.json();
      savedId = data.id;
      localStorage.setItem("userId", savedId);
    }

    setUserId(savedId);

    const res = await fetch(`/api/comments/${savedId}`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
  }

  initUser();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !userId) return;

    await fetch(`/api/comments/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });

    setComment("");

    const res = await fetch(`/api/comments/${userId}`);
    const data = await res.json();
    setComments(data);
  };

  // Clear user comments
  const clearComments = async () => {
    if (!userId) return;

    const res = await fetch(`/api/clear/${userId}`);
    const data = await res.json();
    setComments(data);
  };


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
        <div
          key={`${i}-${c}`}
          className="comment-html"
          dangerouslySetInnerHTML={{ __html: c }}
        />
      ))}

      <button name="clear" onClick={clearComments} style={{ marginTop: "12px" }}>Clear Comments</button>
    </div>
  );
}

export default App;
