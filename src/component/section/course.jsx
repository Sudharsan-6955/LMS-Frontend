import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "../sidebar/rating";
import { API_BASE_URL } from "../../config"; // added

const subTitle = "Latest Courses";
const title = "Pick A Course To Get Started";

const CourseSection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/api/courses`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch courses');
                return res.json();
            })
            .then(data => setCourses(data.slice(0, 6))) // Limit to 6 for homepage
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className="course-section padding-tb section-bg">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">{subTitle}</span>
                    <h2 className="title">{title}</h2>
                </div>
                <div className="section-wrapper">
                    {loading && <div className="text-center py-5">Loading courses...</div>}
                    {error && <div className="text-center text-danger py-5">{error}</div>}
                    {!loading && !error && (
                        <div className="row g-4 justify-content-center row-cols-xl-3 row-cols-md-2 row-cols-1">
                            {courses.map((course, i) => (
                                <div className="col" key={course._id || i}>
                                    <div className="course-item h-100" style={{ minHeight: 420, maxWidth: 370, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
                                        <div className="course-inner d-flex flex-column h-100">
                                            <div className="course-thumb" style={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 12, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={course.imgUrl || '/assets/images/course/default.jpg'} alt={course.imgAlt || course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                                            </div>
                                            <div className="course-content flex-grow-1 d-flex flex-column">
                                                <div className="course-price">
                                                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                                                </div>
                                                <div className="course-category">
                                                    <div className="course-cate">
                                                        <a href="#">{course.cate || course.category || 'General'}</a>
                                                    </div>
                                                    <div className="course-reiew">
                                                        <Rating />
                                                        <span className="ratting-count">{course.reviewCount || 0}</span>
                                                    </div>
                                                </div>
                                                <Link to={`/course-single/${course._id}`}><h4>{course.title}</h4></Link>
                                                <div className="course-details">
                                                    <div className="couse-count">
                                                        <i className="icofont-video-alt"></i> {course.lessons || 0} lessons
                                                    </div>
                                                    <div className="couse-topic">
                                                        <i className="icofont-signal"></i> {course.schedule || 'Flexible'}
                                                    </div>
                                                </div>
                                                <div className="course-footer d-flex justify-content-between align-items-center">
                                                    <div className="course-author d-flex align-items-center">
                                                        <img src={course.author?.image || course.authorDetails?.image || '/assets/images/author/default.jpg'} alt={course.author?.name || course.authorDetails?.name || 'Author'} className="rounded-circle me-2" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                                                        <span>{course.author?.name || course.authorDetails?.name || 'Author'}</span>
                                                    </div>
                                                    <Link to={`/course-single/${course._id}`} className="lab-btn-text btn btn-sm">
                                                        {course.btnText || 'View Details'} <i className="icofont-external-link"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseSection;