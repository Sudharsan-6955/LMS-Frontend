import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeader from "../component/layout/pageheader";

const CourseView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
        const res = await axios.get(`${base}/api/courses/${courseId}`, { timeout: 10000 });
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err?.message || err);
        setError("Unable to load course data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      const firstVideo = getFirstVideoUrl(course);
      setCurrentVideo(firstVideo);
    }
  }, [course]);

  const parseDuration = (durationStr) => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const getFirstVideoUrl = (course) => {
    for (let section of course?.videoContent || []) {
      for (let lesson of section.lessons || []) {
        if (lesson.videoUrl) return lesson.videoUrl;
      }
    }
    return '';
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && currentVideo) {
      const savedTime = parseFloat(localStorage.getItem(`progress-${currentVideo}`)) || 0;
      video.currentTime = savedTime;
    }
  }, [currentVideo]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;

    const percent = (currentTime / duration) * 100;
    setProgress(percent);

    localStorage.setItem(`progress-${currentVideo}`, currentTime);
  };

  if (loading) {
    return (
      <Fragment>
        <Header />
        <PageHeader title="Loading Course..." curPage={'Course View'} />
        <div className="container text-center my-5">
          <h3>Loading, please wait...</h3>
        </div>
        <Footer />
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <Header />
        <PageHeader title="Course Not Found" curPage={'Course View'} />
        <div className="container text-center my-5">
          <h3>{error}</h3>
        </div>
        <Footer />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Header />
      <PageHeader title={course.title} curPage={'Course View'} />

      <div className="course-view-section padding-tb section-bg">
        <div className="container">
          <div className="row justify-content-center">
            {/* Video section */}
            <div className="col-lg-8 col-12 mb-5 mb-lg-0">
              <div className="video-part">
                <div className="vp-title mb-3">
                  <h3>{course.title}</h3>
                </div>

                {currentVideo ? (
                  <div className="vp-video mb-4">
                    <video
                      ref={videoRef}
                      width="100%"
                      height="400"
                      controls
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={() => {
                        const savedTime = parseFloat(localStorage.getItem(`progress-${currentVideo}`)) || 0;
                        videoRef.current.currentTime = savedTime;
                      }}
                    >
                      <source src={currentVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div className="progress mt-3" style={{ height: '20px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
                        {Math.floor(progress)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">No video available.</div>
                )}

                <div className="course-details mt-4">
                  <h5>Introduction</h5>
                  <p>{course.description}</p>

                  {authorInfo && (
                    <div className="author-info d-flex align-items-center mt-4">
                      <img
                        src={authorInfo.image}
                        alt={authorInfo.name}
                        className="rounded-circle me-3"
                        width="60"
                      />
                      <div>
                        <strong>{authorInfo.name}</strong>
                        <p>{authorInfo.desc}</p>
                        <ul className="social-media list-inline">
                          {authorInfo.socialList?.map((val, i) => (
                            <li key={i} className={`list-inline-item ${val.className}`}>
                              <a href={val.link}><i className={val.iconName}></i></a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar lessons */}
            <div className="col-lg-4 col-12">
              <div className="course-side-bar">
                <h5>Course Lessons</h5>
                <div className="accordion" id="courseAccordion">
                  {course.videoContent?.map((section, sIdx) => (
                    <div className="accordion-item" key={sIdx}>
                      <h6 className="accordion-header" id={`heading-${sIdx}`}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${sIdx}`}
                        >
                          Section {sIdx + 1}: {section.title}
                        </button>
                      </h6>
                      <div
                        id={`collapse-${sIdx}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#courseAccordion"
                      >
                        <div className="accordion-body">
                          {section.lessons?.map((lesson, lIdx) => {
                            const lessonKey = `progress-${lesson.videoUrl}`;
                            const saved = parseFloat(localStorage.getItem(lessonKey)) || 0;
                            const total = parseDuration(lesson.duration);
                            const isComplete = total > 0 && saved / total >= 0.95;

                            return (
                              <div
                                key={lIdx}
                                className="lesson-item d-flex justify-content-between align-items-center py-2 border-bottom"
                                onClick={() => {
                                  setCurrentVideo(lesson.videoUrl);
                                  setProgress(0);
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <div>
                                  <i className="icofont-ui-play me-2"></i> {lesson.title}
                                  {isComplete && <i className="icofont-check-circled text-success ms-2"></i>}
                                </div>
                                <span>{lesson.duration}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* End Sidebar */}
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default CourseView;
