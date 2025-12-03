
import Login from "../pages/Login";
import RootLayout from "../layouts/RootLayout";
import { createBrowserRouter } from "react-router";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CourseDetails from "../pages/CourseDetails";
import ProtectedRoute from "../components/ProtectedRoutes";
import Dashboard from "../pages/student/Dashboard";
import CoursePlayer from "../pages/student/CoursePlayer";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageCourse from "../pages/admin/ManageCourses";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: "/courses/:id",
        element: <CourseDetails></CourseDetails>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path:"/dashboard",
        element: <ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>
      },
      {
        path:"/course-player/:id",
        element: <ProtectedRoute><CoursePlayer></CoursePlayer></ProtectedRoute>
      },
      // admin routes
      {
        path:"/admin",
        element: <ProtectedRoute adminOnly><AdminDashboard></AdminDashboard></ProtectedRoute>
      },
      {
        path:"/admin/create-course",
        element:<ProtectedRoute adminOnly><ManageCourse></ManageCourse></ProtectedRoute>
      },
      {
        path: "admin/edit-course/:id",
        element: <ProtectedRoute adminOnly><ManageCourse></ManageCourse></ProtectedRoute>
      }
    ]
  },
]);