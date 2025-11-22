import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import BasePage from "./pages/BasePage";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Projects from "./pages/Projects";
import SearchProjects from "./pages/Projects/SearchProjects";
import MyProjects from "./pages/Projects/MyProjects";
import ProjectDetails from "./pages/Projects/ProjectDetails";

import Freelancer from "./pages/Freelancer";
import SearchFreelancer from "./pages/Freelancer/SearchFreelancer";
import MyJobs from "./pages/Freelancer/MyJobs";
import MyFreelancers from "./pages/Freelancer/MyFreelancers"; // NOVO - UC01

import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Layout base */}
                <Route path="/" element={ <BasePage /> }>

                    {/* Rotas públicas */}
                    <Route index element={ <Home /> } />

                    {/* Rotas privadas */}
                    <Route element={<PrivateRoute />}>
                        {/* Rota de Perfil */}
                        <Route path="/Profile" element={ <Profile /> } />
                        <Route path="/profile/:id" element={<Profile />} />

                        {/* Rota de Freelancer */}
                        <Route path="/freelancers" element={ <Freelancer /> } >
                            <Route path="/freelancers/searchFreelancers" element={ <SearchFreelancer /> }/>
                            <Route path="/freelancers/myJobs" element={ <MyJobs />  }/>
                            {/* NOVO - UC01 - Página de Gestão de Freelancers para Empresa */}
                            <Route path="/freelancers/myFreelancers" element={ <MyFreelancers />  }/>
                        </Route>

                        {/* Rota de Projetos */}
                        <Route path="/projects" element={ <Projects /> } >
                            <Route path="/projects/searchProjects" element={ <SearchProjects />  }/>
                            <Route path="/projects/myProjects" element={ <MyProjects />  }/>
                            <Route path="/projects/:id" element={<ProjectDetails />} />
                        </Route>
                    </Route>

                    {/* Rota Fallback */}
                    <Route path="*" element={ <NotFound /> } />
                </Route>
                
                {/* Rotas de autenticação */}
                <Route path="/login" element={ <Login /> } />
                <Route path="/auth/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;