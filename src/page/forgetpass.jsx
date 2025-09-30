import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeader from "../component/layout/pageheader";

const title = "Forget Password";
const socialTitle = "Forget Password With Social Media";
const btnText = "Submit Now";

const socialList = [
    {
        link: '#',
        iconName: 'icofont-facebook',
        className: 'facebook',
    },
    {
        link: '#',
        iconName: 'icofont-twitter',
        className: 'twitter',
    },
    {
        link: '#',
        iconName: 'icofont-linkedin',
        className: 'linkedin',
    },
    {
        link: '#',
        iconName: 'icofont-instagram',
        className: 'instagram',
    },
    {
        link: '#',
        iconName: 'icofont-pinterest',
        className: 'pinterest',
    },
]

const ForgetPass = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setLoading(true);
        try {
            const apiUrl = "http://localhost:5000";
            const res = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setStatus(res.data.message || "Reset link sent to your email.");
        } catch (err) {
            setStatus(err.response?.data?.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <Header />
            <PageHeader title={'Forget Password'} curPage={'Forget Password'} />
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">{title}</h3>
                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="User Email *"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {status && (
                                <div style={{ color: status.toLowerCase().includes("fail") ? "red" : "green", marginBottom: 10 }}>
                                    {status}
                                </div>
                            )}
                            <div className="form-group text-center">
                                <button className="d-block lab-btn" disabled={loading}>
                                    <span>{loading ? "Submitting..." : btnText}</span>
                                </button>
                            </div>
                        </form>
                        <div className="account-bottom">
                            <span className="d-block cate pt-10">Don’t Have any Account?  <Link to="/login">Login</Link></span>
                            <span className="or"><span>or</span></span>
                            <h5 className="subtitle">{socialTitle}</h5>
                            <ul className="lab-ul social-icons justify-content-center">
                                {socialList.map((val, i) => (
                                    <li key={i}>
                                        <a href={val.link} className={val.className}><i className={val.iconName}></i></a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default ForgetPass;