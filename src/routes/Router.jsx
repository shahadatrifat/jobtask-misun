
import Login from "../pages/Login";
import RootLayout from "../layouts/RootLayout";
import { createBrowserRouter } from "react-router";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CourseDetails from "../pages/CourseDetails";

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
        path:"/login",
        element: <Login></Login>
      },
      {
        path:"/register",
        element: <Register></Register>
      }
    ]
  },
]);