import Rating from "../sidebar/rating";
import { useEffect, useState } from "react";

const PageHeaderTwo = ({ title, desc, author, reviewCount, videoLink, categoryList, isPaid, cate }) => {
    return (
        <div className="pageheader-section style-2">
            <div className="container">
                <div className="row justify-content-center justify-content-lg-between align-items-center flex-row-reverse">
                    {/* Video Preview */}
                    <div className="col-lg-7 col-12">
                        <div className="pageheader-thumb position-relative">
                            <img
                                src="/assets/images/pageheader/02.jpg"
                                alt={title}
                                className="w-100"
                            />
                            {/* Play Button for Video */}
                            {videoLink && (
                                <a
                                    href={videoLink}
                                    className="video-button popup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="icofont-ui-play"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="col-lg-5 col-12">
                        <div className="pageheader-content">
                            {/* Category Badges */}
                            <div className="course-category">
                                {/* Cate label */}
                                {cate && (
                                    <span
                                        className="badge me-2"
                                        style={{ background: '#28c76f', color: '#fff', fontWeight: 600, fontSize: '1rem', padding: '0.4em 1em', borderRadius: '6px' }}
                                    >
                                        {cate}
                                    </span>
                                )}
                                {/* Category label */}
                                {categoryList?.map((item, index) => (
                                    <span
                                        key={index}
                                        className={`badge me-2 ${item.className || ''}`.trim()}
                                        style={{ background: item.className?.includes('css') ? '#28c76f' : '#ff9f43', color: '#fff', fontWeight: 600, fontSize: '1rem', padding: '0.4em 1em', borderRadius: '6px' }}
                                    >
                                        {item.text}
                                    </span>
                                ))}
                                {/* Paid/Free label based on isPaid prop */}
                                <span
                                    className="badge"
                                    style={{ background: isPaid ? '#ff6f00' : '#00cfe8', color: '#fff', fontWeight: 600, fontSize: '1rem', padding: '0.4em 1em', borderRadius: '6px', marginLeft: '0.5em' }}
                                >
                                    {isPaid ? 'Paid' : 'Free'}
                                </span>
                            </div>

                            <h2 className="phs-title">{title}</h2>
                            <p className="phs-desc">{desc}</p>

                            <div className="phs-thumb">
                                <img
                                    src={author && author.image ? author.image : "/assets/images/pageheader/03.jpg"}
                                    alt={author && author.name ? author.name : author}
                                />
                                <span>{author && author.name ? author.name : author}</span>

                                <div className="course-reiew">
                                    <Rating />
                                    <span className="ratting-count">{reviewCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeaderTwo;
