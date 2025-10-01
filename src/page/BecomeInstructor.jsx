import React, { useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "../assets/css/become-instructor.css";
import bg from "../assets/images/bg-img/01.jpg"; // added import

const BecomeInstructor = () => {
  const [form, setForm] = useState({
    name: "",
    degree: "",
    skill: "",
    resume: null
  });
  const resumeInputRef = useRef();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      const file = files[0];
      if (file && file.type !== "application/pdf") {
        setStatus("Only PDF files are allowed for resume upload.");
        setForm({ ...form, resume: null });
        return;
      }
      setForm({ ...form, resume: file });
    } else {
      setForm({ ...form, [name]: value });
    }
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!form.resume) {
      setStatus("Please upload your resume as a PDF file.");
      return;
    }
    setLoading(true);
    try {
      const apiUrl = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("degree", form.degree);
      formData.append("skill", form.skill);
      formData.append("resume", form.resume);
      formData.append("category", form.skill); // Ensure category is sent properly
      console.log(`[Form Submission] Sending category: '${form.skill}'`);
      const res = await axios.post(`${apiUrl}/api/authormail`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 201) {
        setStatus("Application sent! We will call you soon.");
        setForm({ name: "", degree: "", skill: "", resume: null });
        if (resumeInputRef.current) resumeInputRef.current.value = "";
      } else {
        setStatus(res.data.message || "Failed to send application.");
      }
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="become-instructor-bg center-vertical"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="become-instructor-form-container">
        <h1 className="big-heading">Become an Instructor</h1>
        <form className="become-instructor-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree (e.g. M.Sc, Ph.D)"
            value={form.degree}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="skill"
            placeholder="Skill (e.g. English, Math, etc.)"
            value={form.skill}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            required
            ref={resumeInputRef}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Apply Now"}
          </button>
          {status && <div className="form-status">{status}</div>}
        </form>
      </div>
    </div>
  );
};

export default BecomeInstructor;

