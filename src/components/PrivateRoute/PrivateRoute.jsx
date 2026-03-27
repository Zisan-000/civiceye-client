import { useContext } from "react";

import { AuthContext } from "../../provider/AuthProvider";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Show a loading spinner while Firebase checks if the user is logged in
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 2. If user exists, let them through to the children (the page)
  if (user) {
    return children;
  }

  // 3. If no user, redirect them to login and remember where they were trying to go
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
