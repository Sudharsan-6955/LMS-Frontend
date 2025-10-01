import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
// Title and button text constants
const title = "Leave a Comment";
const btnText = "send comment";

const Respond = ({ courseId, onComment, user }) => {
    // Use user info or fallback
    const activeUser = user || { name: "Demo User", email: "demo@example.com" };
    const [form, setForm] = useState({ name: activeUser.name, email: activeUser.email, subject: "", message: "", rating: 0 });
    const [submitting, setSubmitting] = useState(false);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleRating = r => setForm({ ...form, rating: r });
    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.message || !form.rating) return;
        setSubmitting(true);
        try {
            const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
            await axios.post(`${base}/api/comments/${courseId}`, form, { timeout: 10000 });
            setForm({ ...form, subject: "", message: "", rating: 0 });
            if (onComment) onComment();
        } catch (err) {
            console.error("❌ Comment submit failed:", err?.message || err);
        }
        setSubmitting(false);
    };
    return (
        <div id="respond" className="comment-respond mb-lg-0">
            <h4 className="title-border">{title}</h4>
            <div className="add-comment">
                <form onSubmit={handleSubmit} className="comment-form">
                    {/* Name and email are auto-filled and hidden */}
                    <input type="hidden" name="name" value={form.name} />
                    <input type="hidden" name="email" value={form.email} />
                    <input type="text" name="subject" className="w-100" placeholder="Write a Subject" value={form.subject} onChange={handleChange} />
                    <textarea rows="7" name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required></textarea>
                    <div className="star-rating mb-2">
                        {[1,2,3,4,5].map(star => (
                            <span key={star} style={{ cursor: 'pointer', color: star <= form.rating ? '#ff9800' : '#ccc', fontSize: '1.5em' }} onClick={() => handleRating(star)}>
                                {star <= form.rating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                    <button type="submit" className="lab-btn" disabled={submitting}><span>{btnText}</span></button>
                </form>
            </div>
        </div>
    );
}

export default Respond;