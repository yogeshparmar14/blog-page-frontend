import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
 
 import Signup from './Signup';
 import Login from './Login'
 import BlogPage from './BlogPage'
const router = createBrowserRouter([
    {
      path: "/",
      element: <Signup/>,
    },
    {
        path: "/blog-page",
        element: <BlogPage/>,
      },
      {
        path: "/login",
        element: <Login/>,
      },
  ]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

