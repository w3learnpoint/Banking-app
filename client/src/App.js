import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminRoutes from "./routes/Routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useInitUserSettings from "./utils/router";

function App() {
  const settingsLoaded = useInitUserSettings();

  if (!settingsLoaded) return null;

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
      />
      <AdminRoutes />
    </Router>
  );
}

export default App;
