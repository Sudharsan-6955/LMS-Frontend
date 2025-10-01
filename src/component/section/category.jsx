import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config"; // changed to prefer API_BASE_URL

const subTitle = "Popular Category";
const title = "Popular Category For Learn";
const btnText = "Browse All Categories";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);

    const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
    const attempts = [
      `${base}/api/categories`,
      `${base}/categories`,
    ];

    for (const url of attempts) {
      try {
        // eslint-disable-next-line no-console
        console.debug("[Category] attempting fetch:", url);
        const res = await axios.get(url, { headers: { Accept: "application/json" }, timeout: 8000 });
        const data = res.data;
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (Array.isArray(data.categories) ? data.categories : []));
        setCategories(list);
        setLoading(false);
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[Category] fetch failed for", url, err?.message || err);
      }
    }

    setError("Failed to load categories. Check backend and REACT_APP_API_BASE_URL.");
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryData();

    const handleCourseAdded = (event) => {
      setTimeout(() => fetchCategoryData(), 500);
    };
    window.addEventListener("courseAdded", handleCourseAdded);

    // reduce polling frequency
    const interval = setInterval(fetchCategoryData, 15000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("courseAdded", handleCourseAdded);
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
          ) : error ? (
            <div className="alert alert-warning">
              <strong>{error}</strong>
              <div style={{fontSize:'.9rem', color:'#666', marginTop:8}}>
                Confirm your backend is running at <code>{API_BASE_URL || 'http://localhost:5000'}</code> and that <code>/api/categories</code> exists.
              </div>
            </div>
          ) : (
            <div className="row g-2 justify-content-center row-cols-xl-6 row-cols-md-3 row-cols-sm-2 row-cols-1">
              {(categories || []).map((val, i) => (
                <div className="col" key={val._id || i}>
                  <div className="category-item text-center">
                    <div className="category-inner">
                      <div className="category-thumb">
                        <img src={val.imgUrl || 'assets/images/bg-img/01.jpg'} alt={val.imgAlt || val.title} />
                      </div>
                      <div className="category-content">
                        <Link to="/course">
                          <h6>{val.title || val.name || 'Untitled'}</h6>
                        </Link>
                        <span className="course-count">
                          {String(parseInt(val.count, 10) || 0).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/course" className="lab-btn"><span>{btnText}</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/course" className="lab-btn"><span>{btnText}</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
