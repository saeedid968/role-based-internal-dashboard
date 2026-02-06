import React from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/Auth_Context.jsx";
import { UIProvider } from './context/UIContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UIProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </UIProvider>
    </AuthProvider>
  </React.StrictMode>
);
