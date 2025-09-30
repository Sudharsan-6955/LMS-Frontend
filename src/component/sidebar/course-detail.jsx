import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CourseSideDetail = ({ course }) => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage (helps on refresh or login)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Check if current user is enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!course || !currentUser || !currentUser._id) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/enrollments/user/${currentUser._id}`);
        const enrolledCourses = res.data || [];

        const isAlreadyEnrolled = enrolledCourses.some((enr) => {
          const enrolledCourseId = typeof enr.courseId === 'object' ? enr.courseId._id : enr.courseId;
          return enrolledCourseId?.toString() === course._id?.toString();
        });

        setIsEnrolled(isAlreadyEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
      }
    };

    checkEnrollment();
  }, [course?._id, currentUser?._id]);

  const handleEnroll = async () => {
    if (!currentUser || !currentUser._id) {
      alert("Please login to enroll in this course.");
      return navigate('/login');
    }

    try {
      if (course.price === 0) {
        await axios.post('http://localhost:5000/api/enrollments', {
          userId: currentUser._id,
          courseId: course._id,
        });

        alert('Enrolled successfully!');
        setIsEnrolled(true);
      } else {
        alert("This is a paid course. Redirecting to payment...");
        navigate(`/payment/${course._id}`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Already enrolled.");
        setIsEnrolled(true);
      } else {
        console.error('Enrollment error:', error);
        alert('Enrollment failed.');
      }
    }
  };

  if (!course) return null;

  const {
    price = 0, level = "-", duration = "-", classes = "-", lessons = "-",
    quizzes = "-", passPercentage = "-", certificate = "-", language = "-"
  } = course;

  return (
    <div className="course-details-card p-4 rounded shadow-sm border mb-4" style={{ background: "#fff" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="bg-orange text-black px-3 py-2 rounded fw-bold">${price}</div>
        <span className="badge bg-danger">Limited time offer</span>
      </div>

      <ul className="list-unstyled mb-4">
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-certificate me-2"></i>Course level</span><span>{level}</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-clock-time me-2"></i>Duration</span><span>{duration}</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-computer me-2"></i>Online Class</span><span>{classes}</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-read-book me-2"></i>Lessons</span><span>{lessons}</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-quiz me-2"></i>Quizzes</span><span>{quizzes}</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-tasks-alt me-2"></i>Pass %</span><span>{passPercentage}%</span></li>
        <li className="d-flex justify-content-between py-2 border-bottom"><span><i className="icofont-certificate-alt-2 me-2"></i>Certificate</span><span>{certificate}</span></li>
        <li className="d-flex justify-content-between py-2"><span><i className="icofont-globe me-2"></i>Language</span><span>{language}</span></li>
      </ul>

      <div className="mb-3">
        <h6>Secure Payment:</h6>
        <div className="d-flex gap-2 align-items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" width="40" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" width="40" />
        </div>
      </div>

      <div className="mb-3">
        <h6>Share This Course:</h6>
        <div className="d-flex gap-3 fs-5">
          <a href="#"><i className="icofont-twitter"></i></a>
          <a href="#"><i className="icofont-facebook"></i></a>
          <a href="#"><i className="icofont-rss"></i></a>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleEnroll}
          disabled={isEnrolled}
          className={`btn w-100 fw-bold ${isEnrolled ? 'btn-success' : 'btn-orange'}`}
        >
          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseSideDetail;
