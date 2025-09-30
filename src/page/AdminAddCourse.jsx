import { useState, useEffect } from "react";
import axios from "axios";
import CategoryDropdown from "../component/layout/CategoryDropdown";

const AdminAddCourse = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/authors").then(res => setAuthors(res.data));
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
  // reviewCount removed
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
    let token = "";
    try {
      const tokenData = JSON.parse(localStorage.getItem("adminToken"));
      token = tokenData?.token || "";
    } catch {
      token = "";
    }
    if (!token) {
      alert("Admin not logged in or session expired.");
      return;
    }
    try {
      // Use either uploaded file or manual URL for course image
      const imgUrl = imgFile
        ? await uploadToCloudinary(imgFile)
        : (formData.imgUrl || "");
      // Use either uploaded file or manual URL for author image
      const authorImgUrl = authorImgFile
        ? await uploadToCloudinary(authorImgFile)
        : (formData.authorImgUrl || "");

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
        const newAuthorRes = await axios.post("http://localhost:5000/api/authors", {
          name: formData.newAuthorName,
          image: authorImgUrl,
          imgAlt: formData.authorImgAlt,
          desc: formData.authorDesc || "",
          degi: formData.authorDegi || "",
          socialList: []
        });
        authorObj = {
          name: newAuthorRes.data.name,
          image: newAuthorRes.data.image,
          degi: newAuthorRes.data.degi,
          desc: newAuthorRes.data.desc,
          socialList: newAuthorRes.data.socialList || []
        };
        setAuthors(prev => [...prev, newAuthorRes.data]);
      }
      // Always set author.image for backend (for new author, already set above)

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
        author: authorObj ? authorObj : {},
        overview: formData.overview.split(",").map(str => str.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.split(",").map(str => str.trim()),
        videoContent,
        duration: autoDuration,
        isPaid: parseFloat(formData.price) > 0
      };

      console.log(`[Frontend Debug] Submitting course with category: "${payload.category}"`);

      const res = await axios.post("http://localhost:5000/api/courses/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        // Update UI with backend-calculated durations
        setVideoContent(res.data.course.videoContent);
        setFormData({
          title: "",
          price: "",
          lessons: "",
          category: "",
          author: "",
          authorType: "select",
          newAuthorName: "",
          imgAlt: "",
          authorImgAlt: "",
          description: "",
          // reviewCount removed
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
        
        // Trigger a global event to refresh categories on all pages
        window.dispatchEvent(new CustomEvent('courseAdded', { 
          detail: { category: payload.category } 
        }));
        
        // Also manually verify the count update
        setTimeout(async () => {
          try {
            const categoryRes = await axios.get("http://localhost:5000/api/categories");
            console.log('[Frontend Debug] Updated categories:', categoryRes.data);
            const updatedCategory = categoryRes.data.find(c => c.title === payload.category);
            if (updatedCategory) {
              console.log(`[Frontend Debug] Category "${payload.category}" now has count: ${updatedCategory.count}`);
            }
          } catch (err) {
            console.error('Error checking updated categories:', err);
          }
        }, 1000);
        
        alert(`✅ Course "${payload.title}" added to category "${payload.category}"! Check the category page for updated counts.`);
      } else {
        alert("✅ Course added! (No duration info returned)");
      }
    } catch (err) {
      // show full server response when available
      console.error("❌ Error adding course:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Error while adding course";
      alert(serverMsg);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Add New Course</h3>
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

        <button type="submit" className="btn btn-primary">➕ Add Course</button>
      </form>
    </div>
  );
};

export default AdminAddCourse;
