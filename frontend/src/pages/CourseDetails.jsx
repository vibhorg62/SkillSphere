import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Award, CheckCircle, ChevronLeft } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await axios.post(`/api/enrollments/${id}`);
      navigate('/my-courses');
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-dark)]"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl font-bold">{error}</p>
        <Link to="/courses" className="text-blue-500 hover:underline mt-4 inline-block">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/courses" className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Catalog
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="inline-block bg-yellow-100 text-[var(--color-primary-dark)] font-bold px-3 py-1 rounded-full text-sm mb-4">
              {course.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] mb-8 leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex items-center gap-4 border-t border-yellow-200 pt-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-500">
                {course.instructor?.name?.charAt(0) || 'I'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-bold text-[var(--color-text-main)]">{course.instructor?.name}</p>
              </div>
            </div>
          </motion.div>

          {/* What you'll learn (Placeholder for future feature) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-[var(--color-text-muted)]">Master the core concepts and practical applications.</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Checkout Card */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl overflow-hidden sticky top-24 shadow-2xl border border-white/60"
          >
            <div className="h-56 bg-gray-200 relative">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-100">
                  <PlayCircle className="w-16 h-16 text-yellow-400 opacity-50" />
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="text-4xl font-black text-[var(--color-text-main)] mb-6">
                ${course.price}
              </div>
              
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/courses/${course._id}/learn`)}
                  className="btn-primary w-full py-4 text-lg mb-4 flex items-center justify-center gap-2 !bg-green-600 hover:!bg-green-700 !text-white border-none"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Already Enrolled - Go to Course</span>
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling || user?.role === 'instructor'}
                  className="btn-primary w-full py-4 text-lg mb-4 flex items-center justify-center gap-2"
                >
                  {enrolling ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : user?.role === 'instructor' ? (
                    'Instructors Cannot Enroll'
                  ) : (
                    <>
                      <Award className="w-6 h-6" />
                      <span>Pay & Enroll Now</span>
                    </>
                  )}
                </button>
              )}
              
              <p className="text-center text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>
              
              <div className="space-y-4 pt-6 border-t border-yellow-200">
                <div className="flex items-center text-[var(--color-text-muted)]">
                  <PlayCircle className="w-5 h-5 mr-3 text-[var(--color-primary-dark)]" />
                  <span>On-demand video content</span>
                </div>
                <div className="flex items-center text-[var(--color-text-muted)]">
                  <Clock className="w-5 h-5 mr-3 text-[var(--color-primary-dark)]" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center text-[var(--color-text-muted)]">
                  <Award className="w-5 h-5 mr-3 text-[var(--color-primary-dark)]" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
