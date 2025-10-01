import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchAuthorsWithStats = async () => {
  const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
  const axiosOpts = { timeout: 10000 };

  // fetch authors
  let authors = [];
  try {
    const res = await axios.get(`${base}/api/authors`, axiosOpts);
    authors = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
  } catch (err) {
    console.warn("[authorApi] authors fetch failed:", err?.message || err);
    authors = []; // continue with empty list
  }

  // fetch courses
  let courses = [];
  try {
    const res = await axios.get(`${base}/api/courses`, axiosOpts);
    courses = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
  } catch (err) {
    console.warn("[authorApi] courses fetch failed:", err?.message || err);
    courses = [];
  }

  // fetch enrollments (some backends expose /api/enrollments/all)
  let enrollments = [];
  try {
    // try /api/enrollments/all first, fallback to /api/enrollments
    try {
      const res = await axios.get(`${base}/api/enrollments/all`, axiosOpts);
      enrollments = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      const res = await axios.get(`${base}/api/enrollments`, axiosOpts);
      enrollments = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
    }
  } catch (err) {
    console.warn("[authorApi] enrollments fetch failed:", err?.message || err);
    enrollments = [];
  }

  // Map author stats - robust matching
  return authors.map(author => {
    // author identifier may be name or _id
    const authorName = author.name || author.fullName || author.title || "";
    const authorId = author._id || author.id || null;

    const authorCourses = courses.filter(c => {
      // course may store author as object or id or authorDetails
      const ca = c.author || c.authorDetails || c.instructor || null;
      if (!ca) return false;
      // if author stored as object with _id or id
      if (typeof ca === "object") {
        if (ca._id && authorId && String(ca._id) === String(authorId)) return true;
        if (ca.id && authorId && String(ca.id) === String(authorId)) return true;
        if (ca.name && authorName && String(ca.name) === String(authorName)) return true;
      }
      // if author stored as primitive id or name
      if ((authorId && String(ca) === String(authorId)) || (authorName && String(ca) === String(authorName))) {
        return true;
      }
      return false;
    });

    const courseIds = authorCourses.map(c => c._id || c.id).filter(Boolean);
    const students = enrollments.filter(e => courseIds.includes(e.courseId) || courseIds.includes(String(e.courseId)));

    return {
      ...author,
      courseCount: authorCourses.length,
      studentCount: students.length,
      designation: author.degi || author.deg || author.designation || '',
      image: author.image || author.avatar || author.imgUrl || '',
    };
  });
};
