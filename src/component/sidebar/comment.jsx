import { useEffect, useState } from "react";
import axios from "axios";
import Rating from "./rating";
import { API_BASE_URL } from "../../config";

const Comment = ({ courseId, refresh }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${base}/api/comments/${encodeURIComponent(courseId)}`, { timeout: 10000 });
        // handle array or { data: [...] } or { comments: [...] }
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.comments)
          ? res.data.comments
          : [];
        setComments(data);
      } catch (err) {
        console.warn("Comments fetch failed:", err?.response?.data || err?.message || err);
        setComments([]);
      }
    };
    fetchComments();
  }, [courseId, refresh]);

  return (
    <div className="comments">
      <h4 className="title-border">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h4>
      <ul className="comment-list">
        {comments.map((val, i) => (
          <li className="comment" key={val._id || val.id || i}>
            <div className="com-thumb">
              {val.imgUrl ? (
                <img src={val.imgUrl} alt={val.name} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5em', color: '#888' }}>
                  {val.name ? String(val.name).charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="com-content">
              <div className="com-title">
                <div className="com-title-meta">
                  <h6>{val.name || 'Anonymous'}</h6>
                  <span>{val.date ? new Date(val.date).toLocaleString() : ''}</span>
                </div>
                <span style={{ color: '#ff9800', fontSize: '1.2em' }}>
                  {'★'.repeat(Number(val.rating) || 0)}
                  {'☆'.repeat(5 - (Number(val.rating) || 0))}
                </span>
              </div>
              <p>{val.message || val.text || val.body || ''}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comment;