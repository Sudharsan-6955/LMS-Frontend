import { useState, useEffect } from "react";
import '../../assets/css/custom-mobile-dropdown.css';
import { Link, NavLink, useLocation } from "react-router-dom";

const phoneNumber = "+800-123-4567 6587";
const address = "Beverley, New York 224 USA";

const socialList = [
  { iconName: "icofont-facebook-messenger", siteLink: "#" },
  { iconName: "icofont-twitter", siteLink: "#" },
  { iconName: "icofont-vimeo", siteLink: "#" },
  { iconName: "icofont-skype", siteLink: "#" },
  { iconName: "icofont-rss-feed", siteLink: "#" },
];

const Header = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const [socialToggle, setSocialToggle] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const location = useLocation();

  const homeMap = {
    "/": "Home One",
    "/index-2": "Home Two",
    "/index-3": "Home Three",
    "/index-4": "Home Four",
    "/index-5": "Home Five",
    "/index-6": "Home Six",
    "/index-7": "Home Seven",
  };

  useEffect(() => {
    const handleScroll = () => {
      setHeaderFixed(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleMobileMenuToggle = (index, e) => {
    if (window.innerWidth < 992) {
      e.preventDefault(); // Prevent anchor navigation
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    }
  };

  return (
    <header className={`header-section ${headerFixed ? "header-fixed fadeInUp" : ""}`}>
      <div className={`header-top ${socialToggle ? "open" : ""}`}>
        <div className="container">
          <div className="header-top-area">
            <ul className="lab-ul left">
              <li><i className="icofont-ui-call"></i> <span>{phoneNumber}</span></li>
              <li><i className="icofont-location-pin"></i> {address}</li>
            </ul>
            <ul className="lab-ul social-icons d-flex align-items-center">
              <li><p>Find us on : </p></li>
              {socialList.map((val, i) => (
                <li key={i}><a href={val.siteLink}><i className={val.iconName}></i></a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <Link to="/"><img src="/assets/images/logo/01.png" alt="logo" /></Link>
            </div>

            <div className="menu-area">
              <div className="menu">
                {isLoggedIn ? (
                  <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                    <li><NavLink to="/" onClick={() => setMenuToggle(false)}>Home</NavLink></li>
                    <li><NavLink to="/course" onClick={() => setMenuToggle(false)}>Courses</NavLink></li>
                    <li className={`menu-item-has-children ${openMenuIndex === 3 ? "open" : ""}`}
                      onClick={(e) => handleMobileMenuToggle(3, e)}>
                      <a href="#" onClick={(e) => handleMobileMenuToggle(3, e)}>Pages</a>
                      <ul className="lab-ul dropdown-menu" style={{ display: (window.innerWidth < 992 && openMenuIndex === 3) ? 'block' : undefined }}>
                        <li><NavLink to="/about" onClick={() => setMenuToggle(false)}>About</NavLink></li>
                        <li><NavLink to="/team" onClick={() => setMenuToggle(false)}>Team</NavLink></li>
                        <li><NavLink to="/instructor" onClick={() => setMenuToggle(false)}>Instructor</NavLink></li>
                      </ul>
                    </li>
                    <li><NavLink to="/contact" onClick={() => setMenuToggle(false)}>Contact</NavLink></li>
                    <li>
                      <NavLink to="/my-courses" onClick={() => setMenuToggle(false)}>
                        <i className="icofont-book-alt"></i> <span>MY COURSES</span>
                      </NavLink>
                    </li>
                    {/* mobile-only secondary auth for logged users */}
                    <li className="d-lg-none"><NavLink to="/admin-login" onClick={() => setMenuToggle(false)}><i className="icofont-dashboard"></i> DASHBOARD</NavLink></li>
                    <li className="d-lg-none"><a href="#" onClick={() => { setMenuToggle(false); handleLogout(); }}><i className="icofont-logout"></i> LOGOUT</a></li>
                  </ul>
                ) : (
                  // unauthenticated users: show only Login / Signup in the (mobile) menu
                  <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                    <li className="d-lg-none"><NavLink to="/login" onClick={() => setMenuToggle(false)}><i className="icofont-user"></i> LOG IN</NavLink></li>
                    <li className="d-lg-none"><NavLink to="/signup" onClick={() => setMenuToggle(false)}><i className="icofont-users"></i> SIGN UP</NavLink></li>
                  </ul>
                )}
              </div>

              {/* Auth Buttons (desktop) - hidden on small screens */}
              <div className="d-none d-lg-flex align-items-center auth-buttons-desktop" style={{ gap: 8 }}>
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="login">
                      <i className="icofont-user"></i> <span>LOG IN</span>
                    </Link>
                    <Link to="/signup" className="signup">
                      <i className="icofont-users"></i> <span>SIGN UP</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <NavLink to="/admin-login" className="login">
                      <i className="icofont-user"></i> <span>DASHBOARD</span>
                    </NavLink>
                    <button onClick={handleLogout} className="signup">
                      <i className="icofont-logout"></i> <span>LOGOUT</span>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Toggles */}
              <div
                className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`}
                onClick={() => setMenuToggle(!menuToggle)}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="ellepsis-bar d-lg-none" onClick={() => setSocialToggle(!socialToggle)}>
                <i className="icofont-info-square"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;