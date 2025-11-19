import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import BasePage from "./pages/BasePage";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";

import Projects from "./pages/Projects";
import SearchProjects from "./pages/Projects/SearchProjects";
import MyProjects from "./pages/Projects/MyProjects";
import SearchFreelancer from "./pages/Freelancer/SearchFreelancer";
import MyJobs from "./pages/Freelancer/MyJobs";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import Freelancer from "./pages/Freelancer";

import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Auth/Register";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Layout base */}
                <Route path="/" element={ <BasePage /> }>

                    {/* Rotas públicas */}
                    <Route index element={ <Home /> } />

                    {/* Rotas privadas (lembrando que só funciona com autenticação de usuário, tá amor?*/}
                    <Route element={<PrivateRoute />}>
                        {/* Rota de Perfil */}
                        <Route path="/Profile" element={ <Profile /> } />
                        <Route path="/profile/:id" element={<Profile />} />

                        {/* Rota de Freelancer */}
                        <Route path="/freelancers" element={ <Freelancer /> } >
                            <Route path="/freelancers/searchFreelancers" element={ <SearchFreelancer /> }/>
                            <Route path="/freelancers/myJobs" element={ <MyJobs />  }/>
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
                    <Route path="/login" element={ <Login /> } />
                    <Route path="/auth/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;