import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config"; // added import


// NewsletterForm component for handling email subscription
function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [funMsg, setFunMsg] = useState("");

    // Email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleInput = (e) => {
        const val = e.target.value;
        setEmail(val);
        setStatus("");
        if (val.length === 0) {
            setFunMsg("");
        } else if (val.length < 4) {
            setFunMsg("Type a bit more... emails are longer!");
        } else if (!emailRegex.test(val)) {
            setFunMsg("That doesn't look like a real email! 😜");
        } else {
            setFunMsg("Looks good! Ready to subscribe?");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        // client-side validation
        const trimmed = (email || "").trim();
        if (!emailRegex.test(trimmed)) {
            setStatus("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setFunMsg("");
        try {
            const base = (API_BASE_URL || "https://lms-backend-6ik3.onrender.com").replace(/\/$/, "");
            const res = await axios.post(`${base}/api/student-emails`, { email: trimmed }, { timeout: 10000 });
            // accept 200 or 201
            if (res.status === 201 || res.status === 200) {
                setStatus(res.data?.message || "Subscribed successfully!");
                setEmail("");
                setTimeout(() => setStatus(""), 4000);
            } else {
                setStatus(res.data?.message || "Subscription failed");
            }
        } catch (err) {
            // show backend message or generic error
            const msg = err?.response?.data?.message || err?.message || "Subscription failed";
            console.error("Newsletter subscribe error:", msg, err?.response?.data);
            setStatus(msg);
            // keep the email so user can retry/correct
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} autoComplete="off" className="newsletter-form-smooth">
            <div className="nf-list">
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={handleInput}
                    required
                    disabled={loading}
                    className="newsletter-input-smooth"
                    style={{ transition: 'box-shadow 0.3s, border-color 0.3s' }}
                />
                <input
                    type="submit"
                    name="submit"
                    value={loading ? "Subscribing..." : "Subscribe Now"}
                    disabled={loading}
                    className="newsletter-submit-smooth"
                    style={{ transition: 'background 0.3s, color 0.3s, opacity 0.3s' }}
                />
            </div>
            <div style={{ minHeight: 24 }}>
                {funMsg && !status && (
                    <div
                        className="newsletter-funmsg-smooth"
                        style={{ color: '#51e88d', opacity: funMsg ? 1 : 0, transition: 'opacity 0.4s' }}
                    >
                        {funMsg}
                    </div>
                )}
                {status && (
                    <div
                        className="newsletter-status-smooth text-info"
                        style={{ opacity: status ? 1 : 0, transition: 'opacity 0.4s' }}
                    >
                        {status}
                    </div>
                )}
            </div>
        </form>
    );
}

const newsTitle = "Want Us To Email You About Special Offers And Updates?";
const siteTitle = "Site Map";
const useTitle = "Useful Links";
const socialTitle = "Social Contact";
const supportTitle = "Our Support";


const siteList = [
    {
        text: 'Documentation',
        link: '#',
    },
    {
        text: 'Feedback',
        link: '#',
    },
    {
        text: 'Plugins',
        link: '#',
    },
    {
        text: 'Support Forums',
        link: '#',
    },
    {
        text: 'Themes',
        link: '#',
    },
]

const useList = [
    {
        text: 'About Us',
        link: '#',
    },
    {
        text: 'Help Link',
        link: '#',
    },
    {
        text: 'Terms & Conditions',
        link: '#',
    },
    {
        text: 'Contact Us',
        link: '#',
    },
    {
        text: 'Privacy Policy',
        link: '#',
    },
]

const socialList = [
    {
        text: 'Facebook',
        link: '#',
    },
    {
        text: 'Twitter',
        link: '#',
    },
    {
        text: 'Instagram',
        link: '#',
    },
    {
        text: 'YouTube',
        link: '#',
    },
    {
        text: 'Github',
        link: '#',
    },
]

const supportList = [
    {
        text: 'Help Center',
        link: '#',
    },
    {
        text: 'Paid with Mollie',
        link: '#',
    },
    {
        text: 'Status',
        link: '#',
    },
    {
        text: 'Changelog',
        link: '#',
    },
    {
        text: 'Contact Support',
        link: '#',
    },
]






const Footer = () => {
    return (
        <div className="news-footer-wrap fadein-footer">
            <div className="fs-shape">
                <img src="assets/images/shape-img/03.png" alt="fst" className="fst-1" />
                <img src="assets/images/shape-img/04.png" alt="fst" className="fst-2" />
            </div>
            {/* Newsletter Section */}
            <div className="news-letter">
                <div className="container">
                    <div className="section-wrapper">
                        <div className="news-title">
                            <h3>{newsTitle}</h3>
                        </div>
                        <div className="news-form">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Section with smooth fade-in */}
            <footer>
                <div className="footer-top padding-tb pt-0 fadein-footer-section">
                    <div className="container">
                        <div className="row g-4 row-cols-xl-4 row-cols-md-2 row-cols-1 justify-content-center">
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{siteTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {siteList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{useTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {useList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{socialTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {socialList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{supportTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {supportList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom style-2 fadein-footer-section">
                    <div className="container">
                        <div className="section-wrapper">
                            <p>&copy; 2025 <Link to="/">Edukart</Link> Designed by <a href="https://www.sudharsan.codes/" target="_blank" rel="noopener noreferrer">Sudharsan</a> </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
 
export default Footer;

/*
Add the following CSS to your stylesheet for smoothness:

.newsletter-form-smooth .newsletter-input-smooth:focus {
    border-color: #51e88d;
    box-shadow: 0 0 0 2px #51e88d33;
}
.newsletter-form-smooth .newsletter-submit-smooth:hover {
    background: #51e88d;
    color: #fff;
    opacity: 0.9;
}
.newsletter-funmsg-smooth, .newsletter-status-smooth {
    transition: opacity 0.4s;
}
.fadein-footer, .fadein-footer-section {
    opacity: 0;
    animation: fadeInFooter 1.2s ease-in forwards;
}
.fadein-footer-section {
    animation-delay: 0.5s;
}
@keyframes fadeInFooter {
    to { opacity: 1; }
}
*/