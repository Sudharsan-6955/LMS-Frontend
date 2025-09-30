import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeaderTwo from "../component/layout/pageheader-2";
import Author from "../component/sidebar/author";
import Comment from "../component/sidebar/comment";
import CourseSideCetagory from "../component/sidebar/course-cetagory";
import CourseSideDetail from "../component/sidebar/course-detail";
import Respond from "../component/sidebar/respond";

const CourseSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || { name: "Demo User", email: "demo@example.com" };
  const [course, setCourse] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [progressMap, setProgressMap] = useState(() =>
    JSON.parse(localStorage.getItem("videoProgress") || "{}")
  );
  const videoRef = useRef(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
    // Fetch comment count
    axios.get(`http://localhost:5000/api/comments/${id}`)
      .then(res => setCommentCount(res.data.length))
      .catch(() => setCommentCount(0));
  }, [id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration && !video.paused && !video.ended) {
        const percent = (video.currentTime / video.duration) * 100;
        setCurrentProgress(percent);
        setProgressMap((prev) => {
          const updated = { ...prev, [selectedVideoUrl]: percent };
          localStorage.setItem("videoProgress", JSON.stringify(updated));
          return updated;
        });
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [selectedVideoUrl]);

  const isYouTube = (url) => url?.includes("youtube.com") || url?.includes("youtu.be");
  const isMp4 = (url) => url?.endsWith(".mp4");

  const handleAccordionToggle = (index) => {
    setOpenAccordionIndex((prev) => (prev === index ? null : index));
  };

  const formatDuration = (time) => {
    const [min, sec] = time.split(":").map(Number);
    return min * 60 + (sec || 0);
  };

  const getCourseCompletion = () => {
    const allLessons = course?.videoContent?.flatMap((sec) => sec.lessons || []) || [];
    const completed = allLessons.filter((l) => (progressMap[l.videoUrl] || 0) >= 90);
    return Math.round((completed.length / allLessons.length) * 100);
  };

  const getSectionDuration = (section) => {
    const total = section.lessons.reduce((sum, lesson) => sum + formatDuration(lesson.duration), 0);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format total duration in a trendy way (e.g., 1h 11m, 11m)
  const formatTrendyDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalCourseSeconds = course?.videoContent?.reduce((sum, section) => {
    return sum + section.lessons.reduce((s, l) => {
      const parts = l.duration.split(":");
      if (parts.length === 2) {
        return s + (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10));
      }
      return s + parseInt(l.duration, 10) * 60;
    }, 0);
  }, 0);

  const formatTotal = formatTrendyDuration(totalCourseSeconds);

  if (!course) return <p className="text-center py-5">Course not found</p>;

  return (
    <Fragment>
      <Header />
      <PageHeaderTwo
        title={course.title}
        desc={course.description}
        author={course.author && typeof course.author === 'object' ? course.author : { name: course.author }}
        reviewCount={commentCount}
        videoLink={course.videoLink}
        categoryList={course.categoryList}
        isPaid={course.isPaid}
        cate={course.cate}
      />

      <div className="course-single-section padding-tb section-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="main-part">
                <div className="course-item">
                  <div className="course-inner">
                    <div className="course-content">
                      <h3>Course Overview</h3>
                      <p><strong>Total Duration:</strong> {formatTotal}</p>
                      <p><strong>Completion:</strong> {getCourseCompletion()}%</p>
                      {Array.isArray(course.overview) ? (
                        <ul className="lab-ul">
                          {course.overview.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{course.overview}</p>
                      )}

                      {course.whatYouWillLearn?.length > 0 && (
                        <>
                          <h4>What You'll Learn in This Course:</h4>
                          <ul className="lab-ul">
                            {course.whatYouWillLearn.map((item, index) => (
                              <li key={index}>
                                <i className="icofont-tick-mark"></i> {item}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {course.videoContent?.length > 0 && (
                  <div className="course-video mt-4">
                    <h4 className="mb-3">Course Content</h4>
                    <div className="accordion" id="courseContentAccordion">
                      {course.videoContent.map((section, idx) => (
                        <div className="accordion-item" key={idx}>
                          <h2 className="accordion-header" id={`heading${idx}`}>
                            <button
                              className={`accordion-button d-flex align-items-center ${
                                openAccordionIndex === idx ? "" : "collapsed"
                              }`}
                              type="button"
                              onClick={() => handleAccordionToggle(idx)}
                              aria-expanded={openAccordionIndex === idx}
                              aria-controls={`collapse${idx}`}
                              style={{
                                justifyContent: "space-between",
                                boxShadow: "none",
                                outline: "none",
                              }}
                            >
                              <div className="d-flex justify-content-between w-100 align-items-center">
                                <span>{section.title}</span>
                                <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
                                  <span className="text-muted small">{getSectionDuration(section)}</span>
                                  <span className="accordion-icon"></span>
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`collapse${idx}`}
                            className={`accordion-collapse collapse ${openAccordionIndex === idx ? "show" : ""}`}
                            aria-labelledby={`heading${idx}`}
                            data-bs-parent="#courseContentAccordion"
                          >
                            <div className="accordion-body">
                              <ul className="lab-ul video-item-list">
                                {section.lessons?.map((lesson, lessonIdx) => {
                                  const lessonProgress = progressMap[lesson.videoUrl] || 0;
                                  const completed = lessonProgress >= 90;
                                  return (
                                    <li
                                      key={lessonIdx}
                                      onClick={() => {
                                        setSelectedVideoUrl(lesson.videoUrl);
                                        setCurrentProgress(progressMap[lesson.videoUrl] || 0);
                                        navigate(`/course-view/${course._id}`);
                                      }}
                                      style={{ cursor: "pointer" }}
                                      className="d-flex justify-content-between align-items-center py-2"
                                    >
                                      <div className="d-flex align-items-center gap-2">
                                        <i className="icofont-play-alt-2"></i>
                                        <span>{lesson.title}</span>
                                        {completed && <span style={{ color: "green" }}>&#10003;</span>}
                                      </div>
                                      <span className="text-muted small">{lesson.duration}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVideoUrl && (
                  <div className="selected-video-player mt-4">
                    <h5>Now Playing:</h5>
                    <div className="ratio ratio-16x9">
                      {isYouTube(selectedVideoUrl) ? (
                        <iframe
                          src={selectedVideoUrl}
                          title="Course video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : isMp4(selectedVideoUrl) ? (
                        <video ref={videoRef} controls width="100%">
                          <source src={selectedVideoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p>Unsupported video format</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="progress" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${currentProgress.toFixed(0)}%` }}
                          role="progressbar"
                          aria-valuenow={currentProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <p className="text-end small mt-1">Watched: {currentProgress.toFixed(0)}%</p>
                    </div>
                  </div>
                )}

                <Author author={course.author && typeof course.author === 'object' ? course.author : null} />
                {/* Comments and Respond box with refresh logic */}
                {course._id && (
                  <Comment courseId={course._id} refresh={course._id} />
                )}
                {course._id && (
                  <Respond courseId={course._id} onComment={() => setCourse({ ...course })} user={loggedInUser} />
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sidebar-part">
                <CourseSideDetail course={course} user={loggedInUser} />
                <CourseSideCetagory />
                <Author author={course.author && typeof course.author === 'object' ? course.author : null} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

export default CourseSingle;
