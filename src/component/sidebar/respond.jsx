import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

// Title and button text constants
const title = "Leave a Comment";
const btnText = "send comment";

const Respond = ({ courseId, onComment, user }) => {
    const navigate = useNavigate();
    const isLoggedIn = !!user;
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
        rating: 0
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleRating = r => setForm({ ...form, rating: Number(r) });

    const handleSubmit = async e => {
        e.preventDefault();
        if (!isLoggedIn) {
            // client-side guard: ask to login
            if (window.confirm("You must be logged in to post a comment. Go to login page?")) {
                navigate("/login");
            }
            return;
        }
        if (!form.message || !form.rating) {
            alert("Please write a message and select a rating (1-5).");
            return;
        }
        setSubmitting(true);
        try {
            const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
            // send fields backend expects: name, email, message, rating
            const payload = {
                name: form.name || user.name,
                email: form.email || user.email,
                message: form.message.trim(),
                rating: Number(form.rating)
            };
            await axios.post(`${base}/api/comments/${encodeURIComponent(courseId)}`, payload, { timeout: 10000 });
            setForm({ ...form, subject: "", message: "", rating: 0 });
            if (typeof onComment === "function") onComment();
        } catch (err) {
            const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
            console.error("Failed to post comment:", serverMsg);
            alert("Failed to post comment: " + (serverMsg || "Please check console for details"));
        } finally {
            setSubmitting(false);
        }
    };

    // If user not logged in, show clear prompt (no anonymous posting)
    if (!isLoggedIn) {
        return (
            <div id="respond" className="comment-respond mb-lg-0">
                <h4 className="title-border">{title}</h4>
                <div className="add-comment">
                    <div className="alert alert-info">
                        You must <Link to="/login">login</Link> or <Link to="/signup">signup</Link> to post a comment.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="respond" className="comment-respond mb-lg-0">
            <h4 className="title-border">{title}</h4>
            <div className="add-comment">
                <form onSubmit={handleSubmit} className="comment-form">
                    <input type="hidden" name="name" value={form.name} />
                    <input type="hidden" name="email" value={form.email} />
                    <input type="text" name="subject" className="w-100" placeholder="Write a Subject" value={form.subject} onChange={handleChange} />
                    <textarea rows="7" name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required></textarea>
                    <div className="star-rating mb-2">
                        {[1,2,3,4,5].map(star => (
                            <span
                                key={star}
                                style={{ cursor: 'pointer', color: star <= (Number(form.rating)||0) ? '#ff9800' : '#ccc', fontSize: '1.5em' }}
                                onClick={() => handleRating(star)}
                            >
                                {star <= (Number(form.rating)||0) ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                    <button type="submit" className="lab-btn" disabled={submitting}>
                        <span>{submitting ? "Posting..." : btnText}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Respond;