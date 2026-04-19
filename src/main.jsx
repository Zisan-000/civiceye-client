import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router/dom";
import { router } from "./Routes/Routes.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>,
);
