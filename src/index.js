import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './routes';
import { FreelancersProvider } from './context/freelancerContext';
import { ProjectsProvider } from './context/projectContext';
import { AuthProvider } from './context/authContext';

// Simulação do ambiente back-end com o server do MirageJS
if (process.env.NODE_ENV === "development") {
  // importa dinamicamente pra não aumentar bundle em produção
  const { makeServer } = require("./mirage/server");
  makeServer({ environment: "development" });
}

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