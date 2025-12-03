import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { Clock, Users, BookOpen, Award } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) checkEnrollment();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await api.get('/courses/my/enrolled');
      const enrolled = data.some((e) => e.course._id === id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      alert('Successfully enrolled!');
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="text-sm mb-2">{course.category}</div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{course.totalEnrollments} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>{course.modules.length} modules</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm">Instructor: </span>
                <span className="font-semibold">{course.instructor}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white text-gray-900 rounded-lg p-6 h-fit">
              <div className="text-3xl font-bold text-green-600 mb-4">
                ${course.price}
              </div>
              {isEnrolled ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Course Modules</h2>
          {course.modules.length === 0 ? (
            <p className="text-gray-600">No modules available yet.</p>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {idx + 1}. {module.title}
                  </h3>
                  {module.lessons.length > 0 && (
                    <ul className="ml-6 space-y-2">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <li key={lessonIdx} className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} />
                          <span>{lesson.title}</span>
                          <span className="text-sm text-gray-500">({lesson.duration} min)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;