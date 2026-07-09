import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, PlayCircle, Link as LinkIcon, Video, Type, Upload, Trash2 } from 'lucide-react';

const ManageCourse = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lesson form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState('');
  
  const [lessonType, setLessonType] = useState('youtube'); // 'youtube' or 'video'
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}/content`);
      setCourse(res.data.course);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setLessonLoading(true);
    setLessonError('');

    const data = new FormData();
    data.append('title', title);
    
    if (lessonType === 'youtube') {
      data.append('youtubeUrl', youtubeUrl);
    } else {
      if (!videoFile) {
        setLessonError('Please select a video file.');
        setLessonLoading(false);
        return;
      }
      data.append('video', videoFile);
      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }
    }

    try {
      await axios.post(`/api/courses/${id}/lessons`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Reset form and refetch
      setTitle('');
      setYoutubeUrl('');
      setVideoFile(null);
      setThumbnailFile(null);
      if(videoInputRef.current) videoInputRef.current.value = '';
      if(thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      setShowAddForm(false);
      
      await fetchCourse();
    } catch (err) {
      setLessonError(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await axios.delete(`/api/courses/${id}/lessons/${lessonId}`);
      await fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-dark)]"></div>
      </div>
    );
  }

  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/my-courses" className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Dashboard
      </Link>

      <div className="glass-card p-8 rounded-3xl mb-8 flex items-center justify-between">
        <div>
          <div className="inline-block bg-yellow-100 text-[var(--color-primary-dark)] font-bold px-3 py-1 rounded-full text-xs mb-3">
            {course.category}
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-2">{course.title}</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl">{course.description}</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Lesson</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl mb-8 border-2 border-dashed border-yellow-300"
        >
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Add New Lesson</h2>
          
          {lessonError && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
              {lessonError}
            </div>
          )}

          <form onSubmit={handleAddLesson} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="e.g. Introduction to Variables"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setLessonType('youtube')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border transition ${lessonType === 'youtube' ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                <PlayCircle className="w-5 h-5" />
                YouTube Link
              </button>
              <button
                type="button"
                onClick={() => setLessonType('video')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border transition ${lessonType === 'video' ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                <Video className="w-5 h-5" />
                Upload Video
              </button>
            </div>

            {lessonType === 'youtube' ? (
              <div>
                <label className="block text-sm font-medium mb-2">YouTube URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    required
                    className="input-field pl-10"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    required
                    ref={videoInputRef}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Thumbnail (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-end pt-4">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-gray-500 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={lessonLoading}
                className="btn-primary px-8 py-2 flex items-center gap-2"
              >
                {lessonLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Save Lesson
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div>
        <h3 className="text-2xl font-bold mb-6 text-[var(--color-text-main)]">Course Curriculum</h3>
        {(!course.lessons || course.lessons.length === 0) ? (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-gray-100">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No lessons added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.lessons?.map((lesson, index) => (
              <div key={lesson._id} className="glass-card p-5 rounded-xl flex items-center gap-4">
                <div className="bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)] font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                {lesson.thumbnail && (
                  <img src={lesson.thumbnail} alt="thumb" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-grow">
                  <h4 className="font-bold text-[var(--color-text-main)] text-lg">{lesson.title}</h4>
                  <p className="text-sm text-gray-500">
                    {lesson.youtubeUrl ? 'YouTube Video' : 'Uploaded Video'}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteLesson(lesson._id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-auto"
                  title="Delete Lesson"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourse;
