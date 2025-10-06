import { useState, useEffect } from "react";
import axios from "axios";
import CategoryDropdown from "../component/layout/CategoryDropdown";
import { API_BASE_URL } from "../config"; // added

const AdminAddCourse = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
    axios.get(`${base}/api/authors`, { timeout: 10000 })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        if (mounted) setAuthors(data);
      })
      .catch(err => {
        console.error("[AdminAddCourse] Failed to load authors:", err?.response?.data || err?.message || err);
        if (mounted) setAuthors([]);
      });
    return () => { mounted = false; };
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    lessons: "",
    category: "",
    author: "",
    authorType: "select",
    newAuthorName: "",
    authorDegi: "",
    authorDesc: "",
    imgAlt: "",
    authorImgAlt: "",
    authorImgUrl: "",
    description: "",
    videoLink: "",
    overview: "",
    whatYouWillLearn: "",
    level: "",
    duration: "",
    classes: "",
    cate: "",
    skill: "",
    quizzes: "",
    passPercentage: "",
    certificate: "",
    language: ""
  });

  const [imgFile, setImgFile] = useState(null);
  const [authorImgFile, setAuthorImgFile] = useState(null);

  const [videoContent, setVideoContent] = useState([
    { title: "", duration: "", lessons: [{ title: "", videoUrl: "", duration: "" }] }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...videoContent];
    updated[index][field] = value;
    setVideoContent(updated);
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const updated = [...videoContent];
    updated[sectionIndex].lessons[lessonIndex][field] = value;
    setVideoContent(updated);
  };

  const addVideoSection = () => {
    setVideoContent([
      ...videoContent,
      { title: "", duration: "", lessons: [{ title: "", videoUrl: "", duration: "" }] }
    ]);
  };

  const addLessonToSection = (sectionIndex) => {
    const updated = [...videoContent];
    updated[sectionIndex].lessons.push({ title: "", videoUrl: "", duration: "" });
    setVideoContent(updated);
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edukon_uploads"); // You must create this preset in your Cloudinary dashboard
    const cloudName = "rajibraj91"; // Replace with your Cloudinary cloud name
    const apiKey = "482852419699782"; // Safe to use in frontend
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.secure_url || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    
    let token = "";
    try {
      const tokenData = JSON.parse(localStorage.getItem("adminToken"));
      token = tokenData?.token || "";
    } catch {
      token = "";
    }
    if (!token) {
      setError("Admin not logged in or session expired.");
      setLoading(false);
      return;
    }

    try {
      const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
      
      setSuccess("⏳ Uploading images...");
      
      // Use either uploaded file or manual URL for course image
      const imgUrl = imgFile
        ? await uploadToCloudinary(imgFile)
        : (formData.imgUrl || "");
      // Use either uploaded file or manual URL for author image
      const authorImgUrl = authorImgFile
        ? await uploadToCloudinary(authorImgFile)
        : (formData.authorImgUrl || "");

      setSuccess("⏳ Processing author information...");

      let authorObj = null;
      if (formData.authorType === "select") {
        const selectedAuthor = authors.find(a => a._id === formData.author);
        if (selectedAuthor) {
          authorObj = {
            name: selectedAuthor.name,
            image: selectedAuthor.image,
            degi: selectedAuthor.degi,
            desc: selectedAuthor.desc,
            socialList: selectedAuthor.socialList || []
          };
        }
      } else if (formData.authorType === "new" && formData.newAuthorName) {
        // Create new author object directly without backend call
        // Since backend doesn't support POST /api/authors, we'll create the author inline
        authorObj = {
          name: formData.newAuthorName,
          image: authorImgUrl,
          imgAlt: formData.authorImgAlt || "",
          desc: formData.authorDesc || "",
          degi: formData.authorDegi || "",
          socialList: []
        };
        
        console.log("Creating new author inline:", authorObj);
        setSuccess("⏳ Creating new author...");
        
        // Optionally try to add to backend authors if endpoint exists, but don't fail if it doesn't
        try {
          const newAuthorRes = await axios.post(`${base}/api/authors`, {
            name: formData.newAuthorName,
            image: authorImgUrl,
            imgAlt: formData.authorImgAlt,
            desc: formData.authorDesc || "",
            degi: formData.authorDegi || "",
            socialList: []
          }, { 
            timeout: 10000,
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const na = newAuthorRes.data || newAuthorRes.data?.data || newAuthorRes.data?.author || newAuthorRes.data;
          if (na && na._id) {
            // Backend successfully created author, use that data
            authorObj = {
              name: na.name,
              image: na.image,
              degi: na.degi,
              desc: na.desc,
              socialList: na.socialList || []
            };
            setAuthors(prev => [...prev, na]);
            setSuccess("✅ New author created on backend!");
            console.log("✅ Author created on backend:", na);
          }
        } catch (authorErr) {
          console.warn("⚠️ Backend doesn't support author creation, using inline author:", authorErr?.message);
          setSuccess("⚠️ Creating author inline (backend endpoint not available)");
          // Continue with inline author object - this is not a fatal error
        }
      }

      // Validate required fields
      if (!formData.title || !formData.category) {
        setError("Please fill in required fields: Title and Category");
        setLoading(false);
        return;
      }

      if (!authorObj) {
        setError("Please select an author or create a new one");
        setLoading(false);
        return;
      }

      setSuccess("⏳ Calculating video duration...");

      // Calculate total video duration in minutes
      let totalMinutes = 0;
      videoContent.forEach(section => {
        section.lessons.forEach(lesson => {
          // Accept formats like "1:30" (mm:ss) or "60" (minutes)
          if (lesson.duration) {
            const parts = lesson.duration.split(":");
            if (parts.length === 2) {
              totalMinutes += parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
            } else {
              totalMinutes += parseFloat(lesson.duration);
            }
          }
        });
      });
      // Format as "Xh Ym" string
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      const autoDuration = `${hours}h ${minutes}m`;

      const payload = {
        ...formData,
        imgUrl,
        author: authorObj,
        overview: formData.overview ? formData.overview.split(",").map(str => str.trim()) : [],
        whatYouWillLearn: formData.whatYouWillLearn ? formData.whatYouWillLearn.split(",").map(str => str.trim()) : [],
        videoContent,
        duration: autoDuration,
        isPaid: parseFloat(formData.price || 0) > 0
      };

      console.log(`[Frontend Debug] Submitting course with category: "${payload.category}" and author:`, payload.author);
      setSuccess("⏳ Submitting course to server...");

      // POST course to deployed backend
      const res = await axios.post(`${base}/api/courses/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000
      });

      if (res?.data) {
        setSuccess(`✅ Course "${payload.title}" added successfully!`);
        
        // Show alert message for successful course addition
        alert(`✅ Course "${payload.title}" added successfully to category "${payload.category}"!`);
        
        // Update UI with backend-calculated durations
        setVideoContent(res.data.course?.videoContent || videoContent);
        setFormData({
          title: "",
          price: "",
          lessons: "",
          category: "",
          author: "",
          authorType: "select",
          newAuthorName: "",
          authorDegi: "",
          authorDesc: "",
          imgAlt: "",
          authorImgAlt: "",
          authorImgUrl: "",
          description: "",
          videoLink: "",
          overview: "",
          whatYouWillLearn: "",
          level: "",
          duration: "",
          classes: "",
          cate: "",
          skill: "",
          quizzes: "",
          passPercentage: "",
          certificate: "",
          language: ""
        });
        setImgFile(null);
        setAuthorImgFile(null);

        // Reset video content to initial state
        setVideoContent([
          { title: "", duration: "", lessons: [{ title: "", videoUrl: "", duration: "" }] }
        ]);

        // Trigger a global event to refresh categories on all pages
        window.dispatchEvent(new CustomEvent('courseAdded', { detail: { category: payload.category } }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);

        // Verify category update from backend
        setTimeout(async () => {
          try {
            const categoryRes = await axios.get(`${base}/api/categories`, { timeout: 10000 });
            const catData = Array.isArray(categoryRes.data) ? categoryRes.data : (Array.isArray(categoryRes.data?.data) ? categoryRes.data.data : []);
            console.log('[Frontend Debug] Updated categories:', catData);
            const updatedCategory = catData.find(c => String(c.title).toLowerCase() === String(payload.category).toLowerCase());
            if (updatedCategory) {
              console.log(`[Frontend Debug] Category "${payload.category}" now has count: ${updatedCategory.count}`);
            } else {
              console.warn(`[Frontend Debug] Category "${payload.category}" not found in categories list.`);
            }
          } catch (err) {
            console.error('Error checking updated categories:', err?.response?.data || err?.message || err);
          }
        }, 1000);
      } else {
        setSuccess("✅ Course added! (No response data returned)");
        alert("✅ Course added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("❌ Error adding course:", err?.response?.data || err?.message || err);
      
      // Better error handling
      let errorMessage = "Error while adding course";
      
      if (err.response?.status === 400) {
        errorMessage = "Invalid data. Please check all fields and try again.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check if the backend is running.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error occurred";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Add New Course</h3>
      
      {/* Status Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="form-control mb-2" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="form-control mb-2" />
        <input type="number" name="lessons" value={formData.lessons} onChange={handleChange} placeholder="Total Lessons" className="form-control mb-2" />
    {/* Category dropdown only, no duplicate input */}
    <CategoryDropdown value={formData.category} onChange={handleChange} />
           {/* Paid/Free input */}
           <select name="isPaid" value={formData.isPaid ? "Yes" : "No"} onChange={e => setFormData({ ...formData, isPaid: e.target.value === "Yes" })} className="form-control mb-2">
  <option value="Yes">Paid</option>
  <option value="No">Free</option>
</select>

<label>Author</label>
<div className="mb-2 d-flex gap-2">
  {/* Show author dropdown only if not adding new author */}
  {formData.authorType !== "new" && (
    <select
      name="author"
      value={formData.author}
      onChange={e => {
        const selectedId = e.target.value;
        const selectedAuthor = authors.find(a => a._id === selectedId);
        setFormData({
          ...formData,
          author: selectedId,
          authorType: "select",
          authorImgUrl: selectedAuthor?.image || "",
          authorImgAlt: selectedAuthor?.imgAlt || "",
          authorDegi: selectedAuthor?.degi || "",
          authorDesc: selectedAuthor?.desc || ""
        });
      }}
      className="form-control"
    >
      <option value="">Select Author</option>
      {authors.map(a => (
        <option key={a._id} value={a._id}>{a.name}</option>
      ))}
    </select>
  )}
  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData({ ...formData, authorType: "new", author: "" })}>Add New</button>
</div>
{/* Show new author input only if adding new author */}
{formData.authorType === "new" && (
  <input type="text" name="newAuthorName" value={formData.newAuthorName || ""} onChange={e => setFormData({ ...formData, newAuthorName: e.target.value })} placeholder="New Author Name" className="form-control mb-2" />
)}
<input type="text" name="authorDegi" value={formData.authorDegi || ""} onChange={handleChange} placeholder="Author Designation" className="form-control mb-2" />
<textarea name="authorDesc" value={formData.authorDesc || ""} onChange={handleChange} placeholder="Author Description" className="form-control mb-2" />

        <label>Course Image</label>
        {/* Remove file upload for course image, only allow URL input */}
        <input type="text" name="imgUrl" value={formData.imgUrl || ""} onChange={handleChange} placeholder="Course Image URL (Cloudinary or manual)" className="form-control mb-2" />
        {formData.imgUrl && (
          <img src={formData.imgUrl} alt="Course Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
        )}
        <input type="text" name="imgAlt" value={formData.imgAlt} onChange={handleChange} placeholder="Image Alt Text" className="form-control mb-2" />

        <label>Author Image</label>
        {/* Show file input only if no URL entered */}
        {!formData.authorImgUrl && (
          <input type="file" accept="image/*" className="form-control mb-2" onChange={(e) => setAuthorImgFile(e.target.files[0])} />
        )}
        {/* Show URL input only if no file chosen */}
        {!authorImgFile && (
          <input type="text" name="authorImgUrl" value={formData.authorImgUrl || ""} onChange={handleChange} placeholder="Author Image URL (Cloudinary or manual)" className="form-control mb-2" />
        )}
        {formData.authorImgUrl && (
          <img src={formData.authorImgUrl} alt="Author Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
        )}
        <input type="text" name="authorImgAlt" value={formData.authorImgAlt} onChange={handleChange} placeholder="Author Img Alt" className="form-control mb-2" />

        <textarea name="description" placeholder="Description" className="form-control mb-2" value={formData.description} onChange={handleChange} />
  {/* Review Count input removed. Now auto-calculated from comments. */}
        <input type="text" name="videoLink" value={formData.videoLink} onChange={handleChange} placeholder="Main Video Link" className="form-control mb-2" />
        <textarea name="overview" placeholder="Overview (comma-separated)" className="form-control mb-2" value={formData.overview} onChange={handleChange} />
        <textarea name="whatYouWillLearn" placeholder="What You Will Learn (comma-separated)" className="form-control mb-2" value={formData.whatYouWillLearn} onChange={handleChange} />

        <h5 className="mt-4">Video Content</h5>
        {videoContent.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border p-3 mb-3">
            <input
              type="text"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Section Duration"
              value={section.duration}
              onChange={(e) => handleSectionChange(sectionIndex, "duration", e.target.value)}
              className="form-control mb-2"
            />
            {section.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="border p-2 mb-2">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "title", e.target.value)}
                  className="form-control mb-1"
                />
                <input
                  type="text"
                  placeholder="Video URL (YouTube or Cloudinary)"
                  value={lesson.videoUrl}
                  onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "videoUrl", e.target.value)}
                  className="form-control mb-1"
                />
                {/* If video URL is entered, show manual duration input */}
                {lesson.videoUrl && !lesson.videoUrl.startsWith("blob:") && (
                  <input
                    type="text"
                    placeholder="Enter duration (minutes)"
                    value={lesson.duration || ""}
                    onChange={e => handleLessonChange(sectionIndex, lessonIndex, "duration", e.target.value)}
                    className="form-control mb-1"
                  />
                )}
                {/* If file is uploaded, auto-calculate duration */}
                <input
                  type="file"
                  accept="video/*"
                  className="form-control mb-1"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Get video duration automatically
                      const video = document.createElement('video');
                      video.preload = 'metadata';
                      video.onloadedmetadata = async function () {
                        window.URL.revokeObjectURL(video.src);
                        const seconds = video.duration;
                        const minutes = Math.round(seconds / 60);
                        handleLessonChange(sectionIndex, lessonIndex, "duration", minutes.toString());
                        // Upload to Cloudinary
                        const url = await uploadToCloudinary(file);
                        handleLessonChange(sectionIndex, lessonIndex, "videoUrl", url);
                      };
                      video.src = URL.createObjectURL(file);
                    }
                  }}
                />
                <div className="form-control bg-light mb-1">
                  <strong>Lesson Duration:</strong> {(() => {
                    const min = parseInt(lesson.duration, 10);
                    if (!isNaN(min)) {
                      const h = Math.floor(min / 60);
                      const m = min % 60;
                      return `${h}h ${m}m`;
                    }
                    return lesson.duration || '';
                  })()}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-success" onClick={() => addLessonToSection(sectionIndex)}>
              ➕ Add Lesson
            </button>
          </div>
        ))}

          <button type="button" className="btn btn-outline-info mt-2" onClick={addVideoSection}>
            ➕ Add Video Section
          </button>

        {/* Other Fields */}
  <input type="text" name="level" value={formData.level} onChange={handleChange} placeholder="Level" className="form-control mb-2" />
  <div className="form-control mb-2 bg-light">
    <strong>Total Duration (auto):</strong> {(() => {
      let totalMinutes = 0;
      videoContent.forEach(section => {
        section.lessons.forEach(lesson => {
          if (lesson.duration) {
            const parts = lesson.duration.split(":");
            if (parts.length === 2) {
              totalMinutes += parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
            } else {
              totalMinutes += parseFloat(lesson.duration);
            }
          }
        });
      });
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      return `${hours}h ${minutes}m`;
    })()}
  </div>
        <input type="text" name="classes" value={formData.classes} onChange={handleChange} placeholder="Total Classes" className="form-control mb-2" />
        <input type="text" name="cate" value={formData.cate} onChange={handleChange} placeholder="Cate" className="form-control mb-2" />
        <input type="text" name="skill" value={formData.skill} onChange={handleChange} placeholder="Skill" className="form-control mb-2" />
        <input type="number" name="quizzes" value={formData.quizzes} onChange={handleChange} placeholder="Quizzes" className="form-control mb-2" />
        <input type="number" name="passPercentage" value={formData.passPercentage} onChange={handleChange} placeholder="Pass Percentage" className="form-control mb-2" />
        <select name="certificate" value={formData.certificate} onChange={handleChange} className="form-control mb-2">
          <option value="">Certificate</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="form-control mb-2" />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "⏳ Processing..." : "➕ Add Course"}
        </button>
      </form>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="text-center text-white">
            <div className="spinner-border text-light mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Processing Course...</h5>
            <p>Please wait while we save your course</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddCourse;
