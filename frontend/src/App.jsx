import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashBoard from './pages/DashBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails';
import ManageCourse from './pages/ManageCourse';
import LearnCourse from './pages/LearnCourse';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/courses/:id/manage" element={<ManageCourse />} />
              <Route path="/courses/:id/learn" element={<LearnCourse />} />
              <Route path="/my-courses" element={<MyCourses />} />
              {/* Other pages can be added here later */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
