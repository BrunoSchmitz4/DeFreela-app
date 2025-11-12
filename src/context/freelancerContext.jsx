// src/context/freelancersContext.jsx
import { createContext, useContext } from "react";
import { useFreelancers } from "../hooks/useFreelancers";

// Em todo e qualquer componente que eu queira usar esse context, basta eu usar a seguinte const:
// const { freelancers, searchFreelancers } = useFreelancersContext();

const FreelancersContext = createContext();

export function FreelancersProvider({ children }) {
  const { freelancers, loading, searchFreelancers, getFreelancerProfile } = useFreelancers();

  return (
    <FreelancersContext.Provider
      value={{ freelancers, loading, searchFreelancers, getFreelancerProfile }}
    >
      {children}
    </FreelancersContext.Provider>
  );
}

export function useFreelancersContext() {
  return useContext(FreelancersContext);
}
