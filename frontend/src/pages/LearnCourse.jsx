import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, PlayCircle, Video, CheckCircle, Clock } from 'lucide-react';

const LearnCourse = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [marking, setMarking] = useState(false);
  
  // Track selected lesson
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}/content`);
        setCourse(res.data.course);

        // Fetch progress if student
        if (user?.role === 'student') {
          const progRes = await axios.get(`/api/progress/${id}`);
          setCompletedLessons(progRes.data.progress.completedLessons || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course content. Make sure you are enrolled.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-dark)]"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error || 'Course not found'}</p>
        </div>
        <button onClick={() => navigate('/my-courses')} className="btn-primary px-6 py-3">
          Back to My Courses
        </button>
      </div>
    );
  }

  const activeLesson = course.lessons?.[activeLessonIndex];
  const isCompleted = activeLesson && completedLessons.includes(activeLesson._id);

  const handleMarkComplete = async () => {
    if (!activeLesson || isCompleted || marking) return;
    setMarking(true);
    try {
      const res = await axios.post(`/api/progress/${id}/${activeLesson._id}`);
      setCompletedLessons(res.data.progress.completedLessons);
    } catch (err) {
      console.error('Failed to mark as complete', err);
    } finally {
      setMarking(false);
    }
  };

  // Helper to get YouTube embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/my-courses" className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-main)]">{course.title}</h1>
          <p className="text-sm text-gray-500">Instructor: {course.instructor?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (Video Player) */}
        <div className="lg:col-span-2 space-y-6">
          {activeLesson ? (
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl bg-black">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {activeLesson.youtubeUrl ? (
                  <iframe 
                    src={getYoutubeEmbedUrl(activeLesson.youtubeUrl)} 
                    title={activeLesson.title}
                    className="w-full h-full absolute top-0 left-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : activeLesson.videoUrl ? (
                  <video 
                    controls 
                    className="w-full h-full object-contain"
                    poster={activeLesson.thumbnail || course.thumbnail}
                  >
                    <source src={activeLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-white opacity-50 flex flex-col items-center">
                    <Video className="w-16 h-16 mb-4" />
                    <p>No video available for this lesson.</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                    Lesson {activeLessonIndex + 1}: {activeLesson.title}
                  </h2>
                  {user?.role === 'student' && (
                    <button 
                      onClick={handleMarkComplete}
                      disabled={isCompleted || marking}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
                        isCompleted 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] hover:opacity-90'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      {marking ? 'Updating...' : isCompleted ? 'Completed' : 'Mark as Complete'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~10 mins</span>
                  <span className="flex items-center gap-1">
                    {activeLesson.youtubeUrl ? <PlayCircle className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {activeLesson.youtubeUrl ? 'YouTube Video' : 'Platform Video'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Content Available</h2>
              <p className="text-gray-500">The instructor has not added any lessons to this course yet.</p>
            </div>
          )}
          
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Course Description</h3>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Sidebar (Curriculum) */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-[var(--color-primary)]/10 p-5 border-b border-yellow-100">
              <h3 className="font-bold text-lg text-[var(--color-primary-dark)]">Curriculum</h3>
              <p className="text-sm text-gray-500">{course.lessons?.length || 0} Lessons</p>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => (
                  <button
                    key={lesson._id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${
                      activeLessonIndex === idx 
                        ? 'bg-[var(--color-primary-dark)] text-white shadow-md' 
                        : 'hover:bg-yellow-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      activeLessonIndex === idx ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h4 className="font-semibold truncate">{lesson.title}</h4>
                      <p className={`text-xs flex items-center gap-1 ${activeLessonIndex === idx ? 'text-yellow-100' : 'text-gray-400'}`}>
                        {completedLessons.includes(lesson._id) && <CheckCircle className="w-3 h-3 text-green-400" />}
                        {lesson.youtubeUrl ? 'YouTube' : 'Video'}
                      </p>
                    </div>
                    {activeLessonIndex === idx && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  Curriculum is empty.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearnCourse;
