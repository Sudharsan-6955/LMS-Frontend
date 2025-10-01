import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Comment = ({ courseId, refresh }) => {
  const [comments, setComments] = useState([]);
  const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");

  const loadComments = async () => {
    try {
      const res = await axios.get(`${base}/api/comments/${encodeURIComponent(courseId)}`, { timeout: 10000 });
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.comments) ? res.data.comments : []);
      setComments(data);
    } catch (err) {
      console.warn("Comments load failed:", err?.message || err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    loadComments();
  }, [courseId, refresh]);

  return (
    <div className="comment-part mt-4">
      <h5>Comments ({comments.length})</h5>
      <ul className="lab-ul">
        {comments.map((c) => (
          <li key={c._id || c.id || Math.random()}>
            <strong>{c.user?.name || c.name || "Anonymous"}</strong>
            <p>{c.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comment;