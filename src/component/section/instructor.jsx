import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAuthorsWithStats } from "../../api/authorApi";

const subTitle = "World-class Instructors";
const title = "Classes Taught By Real Creators";


const Instructor = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAuthorsWithStats();
                setAuthors(data);
            } catch (err) {
                setError("Failed to load instructors: " + (err.response?.data?.message || err.message));
                // Optionally log the error for debugging
                console.error("Instructor fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="instructor-section padding-tb section-bg">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">{subTitle}</span>
                    <h2 className="title">{title}</h2>
                </div>
                <div className="section-wrapper">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status" style={{ color: '#FFA726', borderColor: '#FFA726 #FFA726 #ffe0b2 #ffe0b2' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center my-4">{error}</div>
                    ) : (
                        <div className="row g-4 justify-content-center row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
                            {authors.map((author, i) => (
                                <div className="col" key={i}>
                                    <div className="instructor-item h-100">
                                        <div className="instructor-inner d-flex flex-column h-100">
                                            <div className="instructor-thumb d-flex align-items-center justify-content-center" style={{ height: '120px', width: '100%' }}>
                                                <img
                                                    src={author.image || '/assets/images/instructor/default.jpg'}
                                                    alt={author.name}
                                                    style={{ height: '90px', width: '90px', objectFit: 'cover', objectPosition: 'center', borderRadius: '50%', border: '3px solid #FFA726', boxShadow: '0 2px 8px rgba(255,167,38,0.15)' }}
                                                />
                                            </div>
                                            <div className="instructor-content flex-grow-1 d-flex flex-column">
                                                <Link to="/team-single"><h4>{author.name}</h4></Link>
                                                <p>{author.designation}</p>
                                            </div>
                                            <div className="instructor-footer mt-auto">
                                                <ul className="lab-ul d-flex flex-wrap justify-content-between align-items-center">
                                                    <li><i className="icofont-book-alt"></i> {author.courseCount} courses</li>
                                                    <li><i className="icofont-users-alt-3"></i> {author.studentCount} students</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center footer-btn">
                        <p>Want to help people learn, grow and achieve more in life?<Link to="/team">Become an instructor</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instructor;