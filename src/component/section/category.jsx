import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config"; // added

const subTitle = "Popular Category";
const title = "Popular Category For Learn";
const btnText = "Browse All Categories";

const Category = () => {
  const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE || "http://localhost:5000"}/api/categories`;
      const { data } = await axios.get(url);
      console.log("[Frontend Debug] Fetched categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();

    // Listen for course additions
    const handleCourseAdded = (event) => {
      console.log("[Category] Course added event received, refreshing categories...", event.detail);
      setTimeout(() => {
        fetchCategoryData(); // Small delay to ensure backend update is complete
      }, 500);
    };

    window.addEventListener('courseAdded', handleCourseAdded);

    // Refresh categories every 5 seconds to show updated counts more frequently
    const interval = setInterval(fetchCategoryData, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('courseAdded', handleCourseAdded);
    };
  }, []);

  return (
    <div className="category-section padding-tb">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>
        <div className="section-wrapper">
          {loading ? (
            <div className="text-center">Loading categories...</div>
          ) : (
            <div className="row g-2 justify-content-center row-cols-xl-6 row-cols-md-3 row-cols-sm-2 row-cols-1">
              {categories.map((val, i) => (
                <div className="col" key={i}>
                  <div className="category-item text-center">
                    <div className="category-inner">
                      <div className="category-thumb">
                        <img src={val.imgUrl} alt={val.imgAlt} />
                      </div>
                      <div className="category-content">
                        <Link to="/course">
                          <h6>{val.title}</h6>
                        </Link>
                        <span className="course-count">
                          {String(parseInt(val.count) || 0).padStart(2, "0")} 
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/course" className="lab-btn">
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
