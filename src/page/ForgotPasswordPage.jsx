import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../component/layout/header";
import Footer from "../component/layout/footer";
import PageHeader from "../component/layout/pageheader";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const apiUrl = "http://localhost:5000";
            const res = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <Header />
            <PageHeader title="Forgot Password" curPage="Forgot Password" />
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">Reset Your Password</h3>
                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {message && <p style={{ color: "green" }}>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <div className="form-group text-center">
                                <button className="d-block lab-btn"><span>Send Reset Link</span></button>
                            </div>
                        </form>
                        <div className="text-center pt-3">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPasswordPage;
