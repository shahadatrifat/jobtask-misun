import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../api/axios';
import { Search, DollarSign, Users } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const categories = ['Web Development', 'Computer Science', 'Data Science', 'Design', 'Business'];

  useEffect(() => {
    fetchCourses();
  }, [search, category, sortBy, order]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('sortBy', sortBy);
      params.append('order', order);

      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Learn Without Limits</h1>
          <p className="text-xl mb-8">Explore thousands of courses from expert instructors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [sort, ord] = e.target.value.split('-');
                  setSortBy(sort);
                  setOrder(ord);
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-semibold mb-2">
                    {course.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.totalEnrollments} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                      <DollarSign size={18} />
                      <span>{course.price}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    By {course.instructor}
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

export default Home;