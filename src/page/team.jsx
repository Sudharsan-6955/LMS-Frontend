import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthorsWithStats } from "../api/authorApi";
import Footer from "../component/layout/footer";
import Header from "../component/layout/header";
import PageHeader from "../component/layout/pageheader";

// Instructors will be fetched from the backend
const TeamPage = () => {
    const [instructorList, setInstructorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAuthorsWithStats();
                setInstructorList(data);
            } catch (err) {
                setError('Failed to load instructors');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

const achieveList = [
    {
        imgUrl: 'assets/images/achive/01.png',
        imgAlt: 'achive thumb rajibraj91 rajibraj',
        title: 'Start Teaching Today',
        desc: 'Seamlessly engage technically sound coaborative reintermed goal oriented content rather than ethica',
        btnText: 'Become A Instructor',
    siteLink: '/become-instructor',
    },
    {
        imgUrl: 'assets/images/achive/02.png',
        imgAlt: 'achive thumb rajibraj91 rajibraj',
        title: 'If You Join Our Course',
        desc: 'Seamlessly engage technically sound coaborative reintermed goal oriented content rather than ethica',
        btnText: 'Register For Free',
    siteLink: '/signup',
    },
]



    return (
        <Fragment>
            <Header />
            <PageHeader title={'All Team Members'} curPage={'Team'} />
            <div className="instructor-section padding-tb section-bg">
                <div className="container">
                    <div className="section-wrapper">
                        {loading ? (
                            <div>Loading instructors...</div>
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : (
                            <div className="row g-4 justify-content-center row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
                                {instructorList.map((val, i) => (
                                    <div className="col" key={i}>
                                        <div
                                            className="instructor-item"
                                            style={{
                                                height: '340px',
                                                minHeight: '300px',
                                                maxHeight: '100vw',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                alignItems: 'stretch',
                                                background: '#fff',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                                padding: '20px',
                                                margin: '0 auto',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <div className="instructor-inner" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <div className="instructor-thumb" style={{width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', marginBottom: '12px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <img
                                                        src={
                                                            (val.name && val.name.toLowerCase().includes('kali') && val.image)
                                                                ? val.image
                                                                : (val.image || 'assets/images/instructor/01.jpg')
                                                        }
                                                        alt={val.name}
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </div>
                                                <div className="instructor-content" style={{textAlign: 'center'}}>
                                                    <h4 style={{margin: '0 0 6px 0', fontSize: '1.1rem'}}>{val.name}</h4>
                                                    <p style={{margin: 0, fontSize: '0.95rem', color: '#666'}}>{val.designation}</p>
                                                    {/* <div style={{marginTop: 8}}><Rating /></div> */}
                                                </div>
                                            </div>
                                            <div className="instructor-footer" style={{marginTop: 12}}>
                                                <ul className="lab-ul d-flex flex-wrap justify-content-between align-items-center" style={{padding: 0, margin: 0, listStyle: 'none', fontSize: '0.95rem'}}>
                                                    <li><i className="icofont-book-alt"></i> {val.courseCount} courses</li>
                                                    <li><i className="icofont-users-alt-3"></i> {val.studentCount} students</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="achieve-part mt-5">
                            <div className="row g-4 row-cols-1 row-cols-lg-2">
                                {achieveList.map((val, i) => (
                                    <div className="col" key={i}>
                                        <div className="achieve-item">
                                            <div className="achieve-inner">
                                                <div className="achieve-thumb">
                                                    <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                                </div>
                                                <div className="achieve-content">
                                                    <h4>{val.title}</h4>
                                                    <p>{val.desc}</p>
                                                    {val.siteLink && val.siteLink.startsWith('/') ? (
                                                        <Link to={val.siteLink} className="lab-btn"><span>{val.btnText}</span></Link>
                                                    ) : (
                                                        <a href={val.siteLink} className="lab-btn"><span>{val.btnText}</span></a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}
 
export default TeamPage;