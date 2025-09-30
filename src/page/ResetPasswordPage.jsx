import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../component/layout/header";
import Footer from "../component/layout/footer";
import PageHeader from "../component/layout/pageheader";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const apiUrl = "http://localhost:5000";
            const res = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, {
                password: form.password,
            });
            if (res.status === 200 || res.status === 201) {
                setSuccess("Password reset successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(res.data.message || "Failed to reset password.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <PageHeader title="Reset Password" curPage="Reset Password" />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h3 className="mb-4">Reset Your Password</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="New Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirm New Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <button className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResetPasswordPage;
