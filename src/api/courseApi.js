// 📁 src/api/courseApi.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchAllCourses = () => API.get('/courses');
export const fetchCourseById = (id) => API.get(`/courses/${id}`);
export const fetchCategories = () => API.get('/courses/categories');
export const fetchAuthors = () => API.get('/courses/authors');
