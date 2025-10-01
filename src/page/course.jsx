import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeader from "../component/layout/pageheader";
import GroupSelect from "../component/sidebar/group-select";
import Pagination from "../component/sidebar/pagination";
import Rating from "../component/sidebar/rating";

// AnimatedCounter component
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let incrementTime = 20;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
}

const CoursePage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'all',
    price: 'all',
    skill: 'all',
  });

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses`);
        setCourses(res.data);
        // Fetch comment counts for each course
        const counts = {};
        await Promise.all(res.data.map(async course => {
          try {
            const commentRes = await axios.get(`${API_BASE_URL}/api/comments/${course._id}`);
            counts[course._id] = commentRes.data.length;
          } catch {
            counts[course._id] = 0;
          }
        }));
        setCommentCounts(counts);
      } catch (err) {
        setError('Failed to fetch courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFilterChange = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      value = value.value || 'all';
    }
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter(course => {
    const categoryMatch =
      filters.category === 'all' || String(course.category).toLowerCase() === filters.category.toLowerCase();
    const languageMatch =
      filters.language === 'all' || String(course.language).toLowerCase() === filters.language.toLowerCase();
    const skillMatch =
      filters.skill === 'all' || String(course.skill).toLowerCase() === filters.skill.toLowerCase();
    const priceMatch =
      filters.price === 'all' ||
      (filters.price === '0' ? course.price === 0 : course.price === Number(filters.price));

    return categoryMatch && languageMatch && skillMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getUniqueOptions = (key) =>
    Array.from(new Set(courses.map(course => course[key]))).filter(Boolean);

  const categoryOptions = getUniqueOptions('category');
  const languageOptions = getUniqueOptions('language');
  const skillOptions = getUniqueOptions('skill');
  const priceOptions = Array.from(new Set(courses.map(c => c.price))).sort((a, b) => a - b);

  return (
    <Fragment>
      <Header />
      <PageHeader title={'Archives: Courses'} curPage={'Course Page'} />

      <div className="course-section pt-5 section-bg">
        <GroupSelect
          onFilterChange={handleFilterChange}
          filters={filters}
          categoryOptions={categoryOptions}
          languageOptions={languageOptions}
          skillOptions={skillOptions}
          priceOptions={priceOptions}
        />

        <div className="container">
          <div className="section-wrapper">
            <div className="course-showing-part">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="course-showing-part-left">
                  <p>Showing {filteredCourses.length} result(s)</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" style={{ color: '#FFA726', borderColor: '#FFA726 #FFA726 #ffe0b2 #ffe0b2' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center my-4">{error}</div>
            ) : (
              <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-md-2 row-cols-1">
                {currentCourses.map((val, i) => (
                  <div className="col" key={val._id || i}>
                    <div className="course-item h-100">
                      <div className="course-inner d-flex flex-column h-100">
                        <div className="course-thumb" style={{ height: '220px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                          <img
                            src={val.imgUrl || "/assets/images/course/default.jpg"}
                            alt={val.imgAlt || val.title || "Course"}
                            style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </div>
                        <div className="course-content flex-grow-1 d-flex flex-column">
                          <div className="course-price">
                            {val.price === 0 ? "Free" : `₹${val.price}`}
                          </div>
                          <div className="course-category">
                            <div className="course-cate">
                              <a href="#">{val.cate || val.category || "General"}</a>
                            </div>
                            <div className="course-reiew">
                              <Rating />
                              <span className="ratting-count"> <AnimatedCounter value={commentCounts[val._id] || 0} /></span>
                            </div>
                          </div>
                          <Link to={`/course-single/${val._id}`}>
                            <h4>{val.title}</h4>
                          </Link>
                          <div className="course-details">
                            <div className="couse-count">
                              <i className="icofont-video-alt"></i> {val.lessons || 0} lessons
                            </div>
                            <div className="couse-topic">
                              <i className="icofont-signal"></i> {val.schedule || "Flexible"}
                            </div>
                          </div>
                          <div className="course-footer d-flex justify-content-between align-items-center mt-auto">
                            <div className="course-author d-flex align-items-center">
                              <img
                                src={val.author?.image || val.authorDetails?.image || "/assets/images/author/default.jpg"}
                                alt={val.author?.name || val.authorDetails?.name || "Author"}
                                className="rounded-circle me-2"
                                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                              />
                                <span className="ca-name text-dark text-decoration-none">
                                  {val.author?.name || val.authorDetails?.name || "Unknown Author"}
                                </span>
                            </div>
                            <div className="course-btn">
                              <Link to={`/course-single/${val._id}`} className="lab-btn-text btn btn-sm">
                                {val.btnText || 'Read More'} <i className="icofont-external-link"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

export default CoursePage;
