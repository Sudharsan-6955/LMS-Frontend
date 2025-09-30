import { useState, useEffect } from "react";
import axios from "axios";

const CategoryDropdown = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then(res => setCategories(res.data));
  }, []);

  return (
    <select name="category" value={value} onChange={onChange} className="form-control mb-2">
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat._id || cat.title} value={cat.title}>{cat.title}</option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
