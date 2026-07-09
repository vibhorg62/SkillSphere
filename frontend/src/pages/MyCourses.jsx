import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, PlusCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCourses = async () => {
    try {
      if (user?.role === 'instructor') {
        const res = await axios.get('/api/courses/instructor/my-courses');
        setCourses(res.data.courses);
        setStats({ total: res.data.courses.length, inProgress: 0, completed: 0 });
      } else if (user) {
        const res = await axios.get('/api/enrollments/my-courses');
        
        const enrols = res.data.enrollments;
        setCourses(enrols.map(e => ({
          ...e.course,
          progressPercentage: e.progressPercentage,
          isCompleted: e.isCompleted
        })));

        let completedCount = enrols.filter(e => e.isCompleted).length;
        setStats({
          total: enrols.length,
          inProgress: enrols.length - completedCount,
          completed: completedCount
        });
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your courses.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="glass-card p-10 rounded-2xl text-center max-w-lg">
          <BookOpen className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-[var(--color-text-main)]">Please Log In</h2>
          <p className="text-[var(--color-text-muted)] mb-6">You need to be logged in to view your courses.</p>
          <Link to="/login" className="btn-primary px-6 py-3 inline-block w-auto">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-2">
              {user.role === 'instructor' ? 'My Created Courses' : 'My Learning Journey'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg">
              {user.role === 'instructor' 
                ? 'Manage and monitor the courses you teach.' 
                : 'Pick up right where you left off.'}
            </p>
          </div>
          
          {user.role === 'instructor' && (
            <Link to="/courses/create" className="btn-primary px-6 py-3 flex items-center gap-2 shadow-md w-full md:w-auto justify-center">
              <PlusCircle className="w-5 h-5" />
              <span>Create New Course</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/40 p-4 rounded-xl text-center">
            <h3 className="text-3xl font-extrabold text-[var(--color-primary-dark)]">{stats.total}</h3>
            <p className="text-sm font-medium text-gray-600">{user.role === 'instructor' ? 'Published' : 'Enrolled'} Courses</p>
          </div>
          {user.role === 'student' && (
            <>
              <div className="bg-white/40 p-4 rounded-xl text-center">
                <h3 className="text-3xl font-extrabold text-orange-500">{stats.inProgress}</h3>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
              </div>
              <div className="bg-white/40 p-4 rounded-xl text-center">
                <h3 className="text-3xl font-extrabold text-green-500">{stats.completed}</h3>
                <p className="text-sm font-medium text-gray-600">Completed</p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-dark)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text-muted)] font-medium">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-2 border-yellow-300">
          <Award className="h-20 w-20 mx-auto text-yellow-400 mb-4 opacity-70" />
          <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">
            {user.role === 'instructor' ? "You haven't created any courses yet" : "You aren't enrolled in any courses"}
          </h3>
          <p className="text-[var(--color-text-muted)] mb-8 text-lg">
            {user.role === 'instructor' 
              ? "Share your knowledge with the world. Create your first course today!" 
              : "Discover new skills and accelerate your career."}
          </p>
          <Link to={user.role === 'instructor' ? "/courses/create" : "/courses"} className="btn-primary px-8 py-4 inline-block w-auto text-lg shadow-lg">
            {user.role === 'instructor' ? 'Create a Course' : 'Browse Catalog'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full bg-white/70"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-500">
                    <BookOpen className="h-12 w-12 opacity-50" />
                  </div>
                )}
                {user.role !== 'instructor' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <PlayCircle className="w-10 h-10 text-[var(--color-primary-dark)]" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-6 line-clamp-2 flex-grow">
                  {course.description}
                </p>
                
                {user.role === 'instructor' ? (
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-yellow-200">
                    <div className="text-sm font-medium text-gray-600">
                      <span className="font-bold text-[var(--color-primary-dark)]">{course.students || 0}</span> Students Enrolled
                    </div>
                    <Link to={`/courses/${course._id}/manage`} className="text-[var(--color-primary-dark)] font-semibold hover:underline">
                      Manage
                    </Link>
                  </div>
                ) : (
                  <div className="mt-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${course.isCompleted ? 'bg-green-500' : 'bg-[var(--color-primary-dark)]'}`} 
                        style={{ width: `${course.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className={course.isCompleted ? 'text-green-600 font-bold' : 'text-gray-600'}>
                        {course.isCompleted ? 'Completed' : `${course.progressPercentage || 0}% Complete`}
                      </span>
                      <Link to={`/courses/${course._id}/learn`} className="text-[var(--color-primary-dark)] font-semibold hover:underline">
                        {course.isCompleted ? 'Review' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
