import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "../pages/Root/Root";
import ErrorPage from "../pages/Error/ErrorPage";
import Home from "../pages/Home/Home";
import ReportProblem from "../pages/Problems/ReportProblem";
import SmartCategoryForm from "../pages/Problems/SmartCategoryForm";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import AuthLayout from "../components/AuthLayout/AuthLayout";
import ProblemList from "../pages/Problems/ProblemList";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import Profile from "../pages/Profile/Profile";
import About from "../pages/Home/About";
import ProblemDetails from "../pages/Problems/ProblemDetails";

export const problemDetailsLoader = async ({ params }) => {
  const response = await fetch(
    `http://localhost:1069/api/complaints/${params.id}`,
  );
  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }
  return response.json();
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "/problems/report",
        element: (
          <PrivateRoute>
            <ReportProblem />
          </PrivateRoute>
        ),
      },
      {
        path: "/problems/categorize",
        element: (
          <PrivateRoute>
            <SmartCategoryForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/problems/list",
        element: (
          <PrivateRoute>
            <ProblemList />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/problems/details/:id",
        element: <ProblemDetails />,
        loader: problemDetailsLoader,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/auth/login",
        element: <Login></Login>,
      },
      {
        path: "/auth/register",
        element: <Register></Register>,
      },
    ],
  },
]);
