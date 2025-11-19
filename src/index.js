import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './routes';
import { FreelancersProvider } from './context/freelancerContext';
import { ProjectsProvider } from './context/projectContext';
import { AuthProvider } from './context/authContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FreelancersProvider>
        <ProjectsProvider>
          <AppRoutes />
        </ProjectsProvider>
      </FreelancersProvider>
    </AuthProvider>
  </React.StrictMode>
);