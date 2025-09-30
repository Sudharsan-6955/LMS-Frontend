import { Fragment, useState, useRef } from "react";
import axios from "axios";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeader from "../component/layout/pageheader";
import GoogleMap from "../component/sidebar/googlemap";


const subTitle = "Get in touch with us";
const title = "We're Always Eager To Hear From You!";
const conSubTitle = "Get in touch with Contact us";
const conTitle = "Fill The Form Below So We Can Get To Know You And Your Needs Better.";
const btnText = "Send our Message";


const contactList = [
    {
        imgUrl: 'assets/images/icon/01.png',
        imgAlt: 'contact icon',
        title: 'Office Address',
        desc: 'PSN College, Tirunelveli, Melathediyoor, 627152',
    },
    {
        imgUrl: 'assets/images/icon/02.png',
        imgAlt: 'contact icon',
        title: 'Phone number',
        desc: '+91 9087675645',
    },
    {
        imgUrl: 'assets/images/icon/03.png',
        imgAlt: 'contact icon',
        title: 'Send email',
        desc: 'sudharsan638294@gmail.com',
    },
    {
        imgUrl: 'assets/images/icon/04.png',
        imgAlt: 'contact icon',
        title: 'Our website',
        desc: 'www.edukon.com',
    },
]



const ContactPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        number: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setStatus("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        // Email validation: must contain @ and .com
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setStatus("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        try {
            // Always use localhost for local development
            const apiUrl = "http://localhost:5000";
            const res = await axios.post(`${apiUrl}/api/feedback`, form);
            if (res.status === 201) {
                setStatus("Feedback submitted successfully!");
                setForm({ name: "", email: "", number: "", subject: "", message: "" });
                if (formRef.current) formRef.current.reset();
            } else {
                setStatus(res.data.message || "Failed to submit feedback.");
            }
        } catch (err) {
            setStatus(err.response?.data?.message || "Failed to submit feedback.");
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <Fragment>
            <Header />
            <PageHeader title={'Get In Touch With Us'} curPage={'Contact Us'} />
            <div className="map-address-section padding-tb section-bg">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{subTitle}</span>
                        <h2 className="title">{title}</h2>
                    </div>
                    <div className="section-wrapper">
                        <div className="row flex-row-reverse">
                            <div className="col-xl-4 col-lg-5 col-12">
                                <div className="contact-wrapper">
                                    {contactList.map((val, i) => (
                                        <div className="contact-item" key={i}>
                                            <div className="contact-thumb">
                                                <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                            </div>
                                            <div className="contact-content">
                                                <h6 className="title">{val.title}</h6>
                                                <p>{val.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-xl-8 col-lg-7 col-12">
                                <GoogleMap />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contact-section padding-tb">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{conSubTitle}</span>
                        <h2 className="title">{conTitle}</h2>
                    </div>
                    <div className="section-wrapper">
                        <form className="contact-form" onSubmit={handleSubmit} ref={formRef} autoComplete="off">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name *"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Your Email *"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="Mobile Number *"
                                    value={form.number}
                                    onChange={e => {
                                        // Only allow 0-9 and max 10 digits
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        setForm({ ...form, number: val });
                                        setStatus("");
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Your Subject *"
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group w-100">
                                <textarea 
                                    rows="8" 
                                    type="text"
                                    name="message"
                                    placeholder="Your Message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group w-100 text-center">
                                <button className="lab-btn" disabled={loading}><span>{loading ? "Sending..." : btnText}</span></button>
                                {status && (
                                    <div
                                        className="mt-3"
                                        style={{
                                            color: status.toLowerCase().includes('success') ? '#51e88d' : '#e74c3c',
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            fontSize: '1.05rem',
                                            marginTop: 12
                                        }}
                                    >
                                        {status}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}



export default ContactPage;