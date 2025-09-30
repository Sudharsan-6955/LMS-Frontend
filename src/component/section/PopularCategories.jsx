import { useEffect, useState } from 'react';
import axios from 'axios';

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="popular-categories">
      <h2>Popular Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.name}>
            {category.name} ({category.courseCount} courses)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularCategories;
