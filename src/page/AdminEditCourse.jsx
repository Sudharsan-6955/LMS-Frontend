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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getApiUrl = () => (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");

  const getAdminToken = () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        const parsed = JSON.parse(adminToken);
        return parsed?.token || adminToken;
      }
    } catch {}
    return localStorage.getItem("token") || "";
  };

  useEffect(() => {
    if (!id) {
      setError("No course ID provided");
      navigate("/admin-dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const apiUrl = getApiUrl();
        
        // Fetch course, authors, and categories in parallel
        const [courseRes, authorsRes, categoriesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/courses/${id}`),
          axios.get(`${apiUrl}/api/authors`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/categories`).catch(() => ({ data: [] }))
        ]);

        const courseData = courseRes.data;
        if (!courseData) {
          setError("Course not found");
          return;
        }

        // Normalize course data
        const normalizedCourse = {
          ...courseData,
          title: courseData.title || "",
          price: Number(courseData.price) || 0,
          lessons: Number(courseData.lessons) || 0,
          category: courseData.category?._id || courseData.category || "",
          author: courseData.author?._id || courseData.author || "",
          imgUrl: courseData.imgUrl || "",
          imgAlt: courseData.imgAlt || "",
          description: courseData.description || "",
          overview: Array.isArray(courseData.overview) 
            ? courseData.overview.join(", ") 
            : courseData.overview || "",
          whatYouWillLearn: Array.isArray(courseData.whatYouWillLearn) 
            ? courseData.whatYouWillLearn.join(", ") 
            : courseData.whatYouWillLearn || "",
          level: courseData.level || "",
          language: courseData.language || "",
          skill: courseData.skill || "",
          duration: courseData.duration || "",
          classes: courseData.classes || "",
          quizzes: Number(courseData.quizzes) || 0,
          passPercentage: Number(courseData.passPercentage) || 0,
          certificate: courseData.certificate || "",
          videoLink: courseData.videoLink || ""
        };

        setCourse(normalizedCourse);
        setAuthors(Array.isArray(authorsRes.data) ? authorsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);

      } catch (err) {
        console.error("Error fetching course data:", err);
        if (err.response?.status === 404) {
          setError("Course not found");
        } else {
          setError("Failed to load course data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    if (!course) return;
    
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    
    setCourse(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const validateForm = () => {
    if (!course.title?.trim()) {
      setError("Course title is required");
      return false;
    }
    if (!course.category) {
      setError("Please select a category");
      return false;
    }
    if (!course.author) {
      setError("Please select an author");
      return false;
    }
    if (course.price < 0) {
      setError("Price cannot be negative");
      return false;
    }
    if (course.lessons < 0) {
      setError("Number of lessons cannot be negative");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!course) return;
    
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;

    const confirmed = window.confirm("Are you sure you want to update this course?");
    if (!confirmed) return;

    setSaving(true);

    try {
      const token = getAdminToken();
      if (!token) {
        setError("Authentication required. Please login again.");
        navigate("/admin-login");
        return;
      }

      const apiUrl = getApiUrl();
      
      // Prepare payload
      const payload = {
        ...course,
        overview: course.overview 
          ? course.overview.split(",").map(item => item.trim()).filter(Boolean)
          : [],
        whatYouWillLearn: course.whatYouWillLearn 
          ? course.whatYouWillLearn.split(",").map(item => item.trim()).filter(Boolean)
          : [],
        price: Number(course.price) || 0,
        lessons: Number(course.lessons) || 0,
        quizzes: Number(course.quizzes) || 0,
        passPercentage: Number(course.passPercentage) || 0
      };

      console.log("Updating course with payload:", payload);

      const response = await axios.put(`${apiUrl}/api/courses/${id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      console.log("Update response:", response.data);
      
      setSuccess("Course updated successfully!");
      
      // Refresh courses list if function provided
      if (fetchCourses) {
        await fetchCourses();
      }

      // Show success message and redirect
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error updating course:", err);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        navigate("/admin-login");
      } else if (err.response?.status === 404) {
        setError("Course not found. It may have been deleted.");
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check all fields and try again.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else {
        setError(err.response?.data?.message || "Failed to update course. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = course && JSON.stringify(course) !== JSON.stringify(course);
    if (hasChanges) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmed) return;
    }
    navigate("/admin-dashboard");
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/admin-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <h4>Course Not Found</h4>
          <p>The requested course could not be found.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/admin-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>✏️ Edit Course</h3>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              ← Back to Dashboard
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Course Title *</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={course.title}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={course.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Lessons</label>
                      <input
                        type="number"
                        name="lessons"
                        className="form-control"
                        value={course.lessons}
                        onChange={handleInputChange}
                        min="0"
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={course.category}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Author *</label>
                      <select
                        name="author"
                        className="form-select"
                        value={course.author}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                      >
                        <option value="">-- Select Author --</option>
                        {authors.map((author) => (
                          <option key={author._id} value={author._id}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Course Image URL</label>
                      <input
                        type="url"
                        name="imgUrl"
                        className="form-control"
                        value={course.imgUrl}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Image Alt Text</label>
                      <input
                        type="text"
                        name="imgAlt"
                        className="form-control"
                        value={course.imgAlt}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={course.description}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Overview (comma-separated)</label>
                  <textarea
                    name="overview"
                    className="form-control"
                    rows="2"
                    value={course.overview}
                    onChange={handleInputChange}
                    placeholder="Enter overview points separated by commas"
                    disabled={saving}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">What You Will Learn (comma-separated)</label>
                  <textarea
                    name="whatYouWillLearn"
                    className="form-control"
                    rows="2"
                    value={course.whatYouWillLearn}
                    onChange={handleInputChange}
                    placeholder="Enter learning outcomes separated by commas"
                    disabled={saving}
                  />
                </div>

                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Level</label>
                      <select
                        name="level"
                        className="form-select"
                        value={course.level}
                        onChange={handleInputChange}
                        disabled={saving}
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Language</label>
                      <input
                        type="text"
                        name="language"
                        className="form-control"
                        value={course.language}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        value={course.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 5h 30m"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Classes</label>
                      <input
                        type="text"
                        name="classes"
                        className="form-control"
                        value={course.classes}
                        onChange={handleInputChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Quizzes</label>
                      <input
                        type="number"
                        name="quizzes"
                        className="form-control"
                        value={course.quizzes}
                        onChange={handleInputChange}
                        min="0"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Pass Percentage</label>
                      <input
                        type="number"
                        name="passPercentage"
                        className="form-control"
                        value={course.passPercentage}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Certificate</label>
                      <select
                        name="certificate"
                        className="form-select"
                        value={course.certificate}
                        onChange={handleInputChange}
                        disabled={saving}
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Video Link</label>
                  <input
                    type="url"
                    name="videoLink"
                    className="form-control"
                    value={course.videoLink}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "✅ Update Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditCourse;
