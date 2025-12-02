
import RootLayout from "../layouts/RootLayout";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <h1>Home</h1>
      },
    ]
  },
]);