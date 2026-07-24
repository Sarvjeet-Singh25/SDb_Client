import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import Visas from "./pages/Visas.jsx";
import Countries from "./pages/Countries.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import JobApply from "./pages/JobApply.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Overview from "./pages/admin/Overview.jsx";
import JobsAdmin from "./pages/admin/JobsAdmin.jsx";
import ContactsAdmin from "./pages/admin/ContactsAdmin.jsx";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin.jsx";
import BlogsAdmin from "./pages/admin/BlogsAdmin.jsx";
import BlogEditor from "./pages/admin/BlogEditor.jsx";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin.jsx";
import ServicesAdmin from "./pages/admin/ServicesAdmin.jsx";
import MediaAdmin from "./pages/admin/MediaAdmin.jsx";
import AdminUsersAdmin from "./pages/admin/AdminUsersAdmin.jsx";
import ProfileSettings from "./pages/admin/ProfileSettings.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/visas" element={<Visas />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<JobApply />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Overview />} />
          <Route path="jobs" element={<JobsAdmin />} />
          <Route path="applications" element={<ApplicationsAdmin />} />
          <Route path="contacts" element={<ContactsAdmin />} />
          <Route path="blogs" element={<BlogsAdmin />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/:id/edit" element={<BlogEditor />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="admins" element={<AdminUsersAdmin />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </>
  );
}
