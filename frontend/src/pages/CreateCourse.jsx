import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, BookOpen, Tag, DollarSign, Type, AlignLeft } from 'lucide-react';

const CreateCourse = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // If not instructor, they shouldn't be here, but route protection will handle that or we can do a simple check
  if (user?.role !== 'instructor') {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    }

    try {
      await axios.post('/api/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-2">Create a New Course</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Share your knowledge and start teaching today.</p>
      </motion.div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="glass-card p-8 rounded-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Course Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                required
                className="input-field pl-10"
                placeholder="e.g. Master React in 30 Days"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="category"
                required
                className="input-field pl-10"
                placeholder="e.g. Web Development"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Price ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                className="input-field pl-10"
                placeholder="e.g. 49.99"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <AlignLeft className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                required
                rows="4"
                className="input-field pl-10 resize-none"
                placeholder="What will students learn in this course?"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Course Thumbnail</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[var(--color-primary)] border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 transition-colors overflow-hidden relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-[var(--color-primary-dark)] mb-3" />
                    <p className="mb-2 text-sm text-[var(--color-text-muted)]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max. 5MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>Create Course</span>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateCourse;
