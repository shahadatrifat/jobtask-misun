import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../api/axios';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await api.get('/courses/my/enrolled');
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Learning Dashboard</h1>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No courses yet</h2>
            <p className="text-gray-600 mb-6">
              Start learning by enrolling in a course
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <Link
                key={enrollment._id}
                to={`/course-player/${enrollment.course._id}`}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
              >
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    By {enrollment.course.instructor}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-blue-600">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>
                        {enrollment.completedLessons.length} lessons completed
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp size={16} />
                      <span>Continue</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;