import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'swiper/css';
import { useEffect } from 'react';


import ScrollToTop from "./component/layout/ScrollToTop";
import ErrorPage from "./page/404";
import AboutPage from "./page/about";
// import BlogPage from "./page/blog";
// import BlogPageTwo from "./page/blog-2";
// import BlogPageThree from "./page/blog-3";
// import BlogSingle from "./page/blog-single";
// import CartPage from "./page/cart-page";
import ContactPage from "./page/contact";
import CoursePage from "./page/course";
import CourseSingle from "./page/course-single";
import CourseView from "./page/course-view";
import ForgetPass from "./page/forgetpass";
import Home from "./page/home";
// import HomeTwo from "./page/home-2";
// import HomeThree from "./page/home-3";
// import HomeFour from "./page/home-4";
// import HomeFive from "./page/home-5";
// import HomeSix from "./page/home-6";
// import HomeSeven from "./page/home-7";
import InstructorPage from "./page/instructor";
import LoginPage from "./page/login";
import SearchNone from "./page/search-none";
import SearchPage from "./page/search-page";
// import ShopPage from "./page/shop";
// import ShopDetails from "./page/shop-single";
import SignupPage from "./page/signup";
import TeamPage from "./page/team";
import TeamSingle from "./page/team-single";
import BecomeInstructor from "./page/BecomeInstructor";
import AuthorApplications from "./page/AuthorApplications";
import ForgotPasswordPage from './page/ForgotPasswordPage';
import ResetPasswordPage from './page/ResetPasswordPage';
import MyEnrolledCourses from "./page/MyEnrolledCourses";
import AdminLogin from "./page/AdminLogin"
import AdminDashboard from "./page/AdminDashboard"
import AdminAddCourse from "./page/AdminAddCourse"
import AdminEditCourse from "./page/AdminEditCourse"
import AdminSignup from './page/AdminSignup';



function App() {
	useEffect(() => {
		const tokenData = localStorage.getItem('adminToken');
		if (tokenData) {
			try {
				const { token, loginTime } = JSON.parse(tokenData);
				if (!token || !loginTime || Date.now() - loginTime > 24 * 60 * 60 * 1000) {
					localStorage.removeItem('adminToken');
				}
			} catch {
				localStorage.removeItem('adminToken');
			}
		}
	}, []);

	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true
			}}
		>
			<ScrollToTop />
			<Routes>
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route path="/admin-dashboard" element={<AdminDashboard />} />
				<Route path="/admin/add-course" element={<AdminAddCourse />} />
				<Route path="/admin-edit-course/:id" element={<AdminEditCourse />} />
				<Route path="/admin-signup" element={<AdminSignup />} />

				<Route path="/" element={<Home />} />
				{/* <Route path="index-2" element={<HomeTwo />} />
				<Route path="index-3" element={<HomeThree />} />
				<Route path="index-4" element={<HomeFour />} />
				<Route path="index-5" element={<HomeFive />} />
				<Route path="index-6" element={<HomeSix />} />
				<Route path="index-7" element={<HomeSeven />} /> */}
				<Route path="course" element={<CoursePage />} />
				<Route path="course-single" element={<CourseSingle />} />
				<Route path="/course-single/:id" element={<CourseSingle />} />
				<Route path="course-view/:courseId" element={<CourseView />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
				<Route path="/my-courses" element={<MyEnrolledCourses />} />
				{/* <Route path="blog" element={<BlogPage />} />
				<Route path="blog-2" element={<BlogPageTwo />} />
				<Route path="blog-3" element={<BlogPageThree />} />
				<Route path="blog-single" element={<BlogSingle />} /> */}
				<Route path="about" element={<AboutPage />} />
				<Route path="team" element={<TeamPage />} />
				<Route path="team-single" element={<TeamSingle />} />
				<Route path="instructor" element={<InstructorPage />} />
				{/* <Route path="shop" element={<ShopPage />} />
				<Route path="shop-single" element={<ShopDetails />} />
				<Route path="cart-page" element={<CartPage />} /> */}
				<Route path="search-page" element={<SearchPage />} />
				<Route path="search-none" element={<SearchNone />} />
				<Route path="contact" element={<ContactPage />} />
				<Route path="become-instructor" element={<BecomeInstructor />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="signup" element={<SignupPage />} />
				<Route path="forgetpass" element={<ForgetPass />} />
				<Route path="admin/author-applications" element={<AuthorApplications />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
