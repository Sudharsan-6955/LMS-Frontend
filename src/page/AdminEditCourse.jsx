import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AdminEditCourse = ({ fetchCourses }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const getApiUrl = () => (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

  const getAdminToken = () => {
    // Try common storage shapes
    try {
      const rawA = localStorage.getItem("adminToken");
      if (rawA) {
        const parsed = JSON.parse(rawA);
        if (parsed?.token) return parsed.token;
        if (typeof rawA === "string" && rawA.trim()) return rawA;
      }
    } catch {}
    try {
      const rawB = localStorage.getItem("adminData");
      if (rawB) {
        const parsed = JSON.parse(rawB);
        if (parsed?.token) return parsed.token;
        if (parsed?.accessToken) return parsed.accessToken;
      }
    } catch {}
    // fallback plain token
    return localStorage.getItem("token") || "";
  };

  useEffect(() => {
    if (!id) {
      // If route was accessed without id, redirect back
      navigate("/admin-dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = getApiUrl();
        const [courseRes, authorRes, categoryRes] = await Promise.all([
          axios.get(`${apiUrl}/api/courses/${id}`),
          axios.get(`${apiUrl}/api/authors`),
          axios.get(`${apiUrl}/api/categories`),
        ]);

        // Normalize course: ensure category and author are IDs (strings)
        const c = courseRes.data || null;
        if (!c) {
          setCourse(null);
          setSuccessMsg("Course not found or deleted.");
        } else {
          const normalized = {
            ...c,
            // category can be object {_id, title} or id string or title string
            category: c?.category?._id || c?.category || "",
            // author can be object {_id, name} or id string or name string
            author: c?.author?._id || c?.author || "",
            title: c?.title || "",
            price: typeof c?.price === "number" ? c.price : Number(c?.price) || 0,
            lessons: typeof c?.lessons === "number" ? c.lessons : Number(c?.lessons) || 0,
            imgUrl: c?.imgUrl || "",
            imgAlt: c?.imgAlt || "",
          };
          setCourse(normalized);
          setSuccessMsg("");
        }
        setAuthors(authorRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        setCourse(null);
        setSuccessMsg("Course not found or deleted.");
        console.error("❌ Error loading data:", err?.message || err);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    if (!course) return;
    const { name, value, type } = e.target;
    let parsed = value;
    if (type === "number") {
      parsed = value === "" ? "" : Number(value);
    }
    setCourse({ ...course, [name]: parsed });
  };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course || !course._id) {
      alert("Course not found or deleted. Cannot update.");
      return;
    }
    if (!isValidObjectId(id)) {
      alert("Invalid course ID. Cannot update.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to update this course?");
    if (!confirmed) return;

    const token = getAdminToken();
    if (!token) {
      alert("Admin not logged in or session expired.");
      return;
    }

    try {
      const apiUrl = getApiUrl();
      // Make sure category & author are IDs when sending
      const payload = {
        ...course,
        category: course.category,
        author: course.author,
      };

      const res = await axios.put(`${apiUrl}/api/courses/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("✅ Course updated successfully!");
      if (fetchCourses) fetchCourses();
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/admin-dashboard");
      }, 1200);
    } catch (err) {
      setSuccessMsg("");
      if (err.response?.status === 404) {
        alert("Course not found. It may have been deleted.");
      } else {
        alert("Failed to update course. Please try again.");
      }
      console.error("❌ Error updating course:", err?.message || err);
    }
  };

  if (!course) return <div className="text-center py-4 text-danger">{successMsg || "Course not found."}</div>;

  // compute current selection ids (in case backend returned names/titles previously)
  const currentCategoryId = course.category;
  const currentAuthorId = course.author;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">✏️ Edit Course</h3>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Course Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={course.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={course.price}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Lessons</label>
          <input
            type="number"
            name="lessons"
            className="form-control"
            value={course.lessons}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select
            name="category"
            className="form-select"
            value={currentCategoryId}
            onChange={handleChange}
          >
            <option value="">-- Select category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Author</label>
          <select
            name="author"
            className="form-select"
            value={currentAuthorId}
            onChange={handleChange}
          >
            <option value="">-- Select author --</option>
            {authors.map((auth) => (
              <option key={auth._id} value={auth._id}>
                {auth.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="text"
            name="imgUrl"
            className="form-control"
            value={course.imgUrl}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Image Alt</label>
          <input
            type="text"
            name="imgAlt"
            className="form-control"
            value={course.imgAlt}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          ✅ Update Course
        </button>
      </form>
    </div>
  );
};

export default AdminEditCourse;
