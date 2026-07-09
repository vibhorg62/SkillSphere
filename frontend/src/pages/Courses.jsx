import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(res.data.courses);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses. Please make sure you are logged in.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-4">Course Catalog</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Discover a wide range of courses taught by expert instructors.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-10 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/50 transition font-medium">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-dark)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text-muted)] font-medium">Loading amazing courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-main)]">No courses found</h3>
          <p className="text-[var(--color-text-muted)] mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/courses/${course._id}`} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full bg-white/60 block cursor-pointer">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-500">
                      <BookOpen className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[var(--color-text-main)] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {course.category}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-yellow-200">
                    <div className="text-sm font-medium text-gray-600">
                      By {course.instructor?.name || 'Unknown'}
                    </div>
                    <div className="text-lg font-bold text-[var(--color-primary-dark)]">
                      ${course.price}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
