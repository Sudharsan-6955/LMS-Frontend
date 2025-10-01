import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const title = "Course Categories";

const CourseSideCetagory = () => {
  const [categories, setCategories] = useState([]);
  const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get(`${base}/api/categories`, { timeout: 10000 });
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        if (mounted) setCategories(data);
      } catch (err) {
        console.error("❌ Error loading categories:", err?.response?.data || err?.message || err);
        if (mounted) setCategories([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, [base]);

  return (
    <div className="widget widget-category">
      <div className="widget-header">
        <h5 className="title">{title}</h5>
      </div>
      <ul className="widget-wrapper">
        {categories.length === 0 ? (
          <li>No categories available</li>
        ) : (
          categories.map((cat, i) => (
            <li key={cat._id || cat.id || i}>
              <Link to="/course" className="d-flex flex-wrap justify-content-between">
                <span><i className="icofont-double-right"></i> {cat.title || cat.name || 'Untitled'}</span>
                <span>{String(parseInt(cat.count || cat.courseCount || 0, 10)).padStart(2, "0")}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CourseSideCetagory;
