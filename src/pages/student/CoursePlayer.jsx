import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import api from '../../api/axios';
import { CheckCircle, Circle, ChevronRight, ChevronDown } from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState([0]); // First module open by default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrolledRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get('/courses/my/enrolled'),
      ]);

      setCourse(courseRes.data);
      const enrolled = enrolledRes.data.find((e) => e.course._id === id);
      setEnrollment(enrolled);

      // Set first lesson as default
      if (courseRes.data.modules.length > 0 && courseRes.data.modules[0].lessons.length > 0) {
        setCurrentLesson(courseRes.data.modules[0].lessons[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.completedLessons.includes(lessonId);
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      const { data } = await api.post(`/courses/${id}/complete-lesson`, { lessonId });
      
      // Update enrollment state
      setEnrollment((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        progress: data.progress,
      }));

      alert('Lesson marked as completed!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark lesson');
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Course Content */}
      <div className="w-96 bg-white border-r overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-2">{course.title}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${enrollment?.progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {enrollment?.progress || 0}% Complete
          </p>
        </div>

        {/* Modules */}
        <div className="p-4">
          {course.modules.map((module, moduleIdx) => (
            <div key={moduleIdx} className="mb-4">
              <button
                onClick={() => toggleModule(moduleIdx)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold"
              >
                <span>{module.title}</span>
                {expandedModules.includes(moduleIdx) ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {expandedModules.includes(moduleIdx) && (
                <div className="mt-2 space-y-1">
                  {module.lessons.map((lesson) => {
                    const lessonId = `${moduleIdx}-${lesson.order}`;
                    const completed = isLessonCompleted(lessonId);

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          currentLesson?._id === lesson._id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle size={20} className="text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-sm text-gray-500">{lesson.duration} min</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 overflow-y-auto">
        {currentLesson ? (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">{currentLesson.title}</h1>

            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <iframe
                width="100%"
                height="500"
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>

            {/* Mark Complete Button */}
            {!isLessonCompleted(`${course.modules.findIndex(m => m.lessons.some(l => l._id === currentLesson._id))}-${currentLesson.order}`) && (
              <button
                onClick={() => {
                  const moduleIdx = course.modules.findIndex(m => 
                    m.lessons.some(l => l._id === currentLesson._id)
                  );
                  const lessonId = `${moduleIdx}-${currentLesson.order}`;
                  handleMarkComplete(lessonId);
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl text-gray-600">Select a lesson to start learning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;