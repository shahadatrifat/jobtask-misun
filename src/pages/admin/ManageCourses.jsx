import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../../api/axios';
import { Plus, Trash2 } from 'lucide-react';

const ManageCourse = () => {
  const { id } = useParams(); // If editing, id will be present
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    thumbnail: '',
    category: 'Web Development',
    tags: '',
    modules: [],
  });

  const categories = ['Web Development', 'Computer Science', 'Data Science', 'Design', 'Business'];

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setFormData({
        ...data,
        tags: data.tags.join(', '),
      });
    } catch (error) {
      alert('Failed to load course');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { title: '', order: formData.modules.length + 1, lessons: [] },
      ],
    });
  };

  const handleRemoveModule = (index) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleAddLesson = (moduleIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      videoUrl: '',
      duration: '',
      order: updatedModules[moduleIndex].lessons.length + 1,
    });
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(',').map((tag) => tag.trim()),
      };

      if (isEditing) {
        await api.put(`/courses/${id}`, payload);
        alert('Course updated successfully!');
      } else {
        await api.post('/courses', payload);
        alert('Course created successfully!');
      }

      navigate('/admin');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-2">Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instructor *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail URL *</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Modules */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Course Modules</h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Module
              </button>
            </div>

            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Module {moduleIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(moduleIndex)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Lessons */}
                <div className="ml-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Lessons</span>
                    <button
                      type="button"
                      onClick={() => handleAddLesson(moduleIndex)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border rounded-lg p-3 mb-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Lesson {lessonIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded mb-2 text-sm"
                      />

                      <input
                        type="url"
                        placeholder="Video URL (YouTube embed)"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, 'videoUrl', e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded mb-2 text-sm"
                      />

                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={lesson.duration}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCourse;