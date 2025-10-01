import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

const MyEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !user._id) return;

      try {
        const baseUrl = API_BASE_URL;
        // 1. Fetch enrollments for the logged-in user
        const res = await axios.get(`${baseUrl}/api/enrollments/user/${user._id}`);
        const enrollmentList = res.data;

        // 2. Fetch full course details for each courseId
        const coursePromises = enrollmentList.map(enroll =>
          axios.get(`${baseUrl}/api/courses/${enroll.courseId}`)
        );
        const courseResponses = await Promise.all(coursePromises);

        const fullCourses = courseResponses.map(res => res.data);
        setEnrolledCourses(fullCourses);
      } catch (error) {
        console.error('❌ Error fetching enrolled courses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Courses</h2>

      {enrolledCourses.length === 0 ? (
        <div className="alert alert-info">You have not enrolled in any courses yet.</div>
      ) : (
        <div className="row">
          {enrolledCourses.map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card h-100">
                <img src={course.imgUrl} className="card-img-top" alt={course.imgAlt || course.title} />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description?.slice(0, 100)}...</p>
                  <p className="card-text">
                    <strong>Price:</strong> {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </p>
                  <a href={`/course-single/${course._id}`} className="btn btn-primary">Go to Course</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
