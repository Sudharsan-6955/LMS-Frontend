import { useEffect, useState } from "react";
import axios from "axios";

const title = "Course Categories";

const CourseSideCetagory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/categories");
        setCategoryList(data);
      } catch (error) {
        console.error("❌ Error loading categories:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  return (
    <div className="course-side-cetagory border p-4 rounded-xl shadow">
      <div className="csc-title mb-3">
        <h5 className="text-lg font-semibold">{title}</h5>
      </div>
      <div className="csc-content">
        <div className="csdc-lists">
          {categoryList.length === 0 ? (
            <div className="text-sm text-gray-500">No categories available.</div>
          ) : (
            <ul className="lab-ul space-y-2">
              {categoryList.map((val, i) => (
                <li key={val._id || i} className="flex justify-between items-center">
                  <div className="csdc-left text-blue-600 hover:underline">
                    <a href="#">{val.title}</a>
                  </div>
                  <div className="csdc-right text-gray-600 text-sm">{val.count}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSideCetagory;
