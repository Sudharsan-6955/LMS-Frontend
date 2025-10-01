import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

// Title and button text constants
const title = "Leave a Comment";
const btnText = "send comment";

const Respond = ({ courseId, onComment, user }) => {
    const activeUser = user || { name: "Demo User", email: "demo@example.com" };
    const [form, setForm] = useState({ name: activeUser.name, email: activeUser.email, subject: "", message: "", rating: 0 });
    const [submitting, setSubmitting] = useState(false);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleRating = r => setForm({ ...form, rating: Number(r) });

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.message || !form.rating) {
            alert("Please write a message and select a rating (1-5).");
            return;
        }
        setSubmitting(true);
        try {
            const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
            // send fields backend expects: name, email, message, rating
            const payload = {
                name: form.name || activeUser.name,
                email: form.email || activeUser.email,
                message: form.message.trim(),
                rating: Number(form.rating)
            };
            const res = await axios.post(`${base}/api/comments/${encodeURIComponent(courseId)}`, payload, { timeout: 10000 });
            setForm({ ...form, subject: "", message: "", rating: 0 });
            if (typeof onComment === "function") onComment();
            // optional: show success message
        } catch (err) {
            const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
            console.error("Failed to post comment:", serverMsg);
            alert("Failed to post comment: " + (serverMsg || "Please check console for details"));
        } finally {
            setSubmitting(false);
        }
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
                            <span key={star} style={{ cursor: 'pointer', color: star <= (Number(form.rating)||0) ? '#ff9800' : '#ccc', fontSize: '1.5em' }} onClick={() => handleRating(star)}>
                                {star <= (Number(form.rating)||0) ? "★" : "☆"}
                            </span>
                        ))}
                    </div>
                    <button type="submit" className="lab-btn" disabled={submitting}><span>{submitting ? "Posting..." : btnText}</span></button>
                </form>
            </div>
        </div>
    );
}

export default Respond;