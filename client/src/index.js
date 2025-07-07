import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ProfileProvider } from './context/ProfileContext'; // ✅ Import provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProfileProvider> {/* ✅ Wrap App */}
      <App />
    </ProfileProvider>
  </React.StrictMode>
);

reportWebVitals();
