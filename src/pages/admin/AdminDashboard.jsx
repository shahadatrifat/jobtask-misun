import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../api/axios';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses?limit=100');
      setCourses(data.courses);
      
      // Calculate stats
      const totalEnrollments = data.courses.reduce((sum, course) => sum + course.totalEnrollments, 0);
      setStats({
        totalCourses: data.courses.length,
        totalEnrollments,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      alert('Course deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link
            to="/admin/create-course"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Users size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Courses</h2>
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              No courses yet. Create your first course!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Enrollments
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold">{course.title}</div>
                            <div className="text-sm text-gray-600">
                              By {course.instructor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{course.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${course.price}
                      </td>
                      <td className="px-6 py-4 text-sm">{course.totalEnrollments}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/edit-course/${course._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(course._id, course.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;