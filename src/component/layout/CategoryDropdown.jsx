import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const CategoryDropdown = ({ value, onChange, name = "category" }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
    axios
      .get(`${base}/api/categories`, { timeout: 10000 })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        if (mounted) setCategories(data);
      })
      .catch((err) => {
        console.error("[CategoryDropdown] Failed to load categories:", err?.response?.data || err?.message || err);
        if (mounted) setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <select
      name={name}
      value={value || ""}
      onChange={(e) => {
        // Emit native-like event so parent handleChange works unchanged
        if (typeof onChange === "function") onChange(e);
      }}
      className="form-control mb-2"
    >
      <option value="">Select Category</option>
      {categories.map((cat, i) => (
        <option key={cat._id || cat.id || i} value={cat.title || cat.name || cat._id}>
          {cat.title || cat.name || "Untitled"}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
