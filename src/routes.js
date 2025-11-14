import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import BasePage from "./pages/BasePage";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";

import Contracts from "./pages/Freelancer";


import Projects from "./pages/Projects";
import SearchProjects from "./pages/Projects/SearchProjects";
import MyProjects from "./pages/Projects/MyProjects";
import SearchFreelancer from "./pages/Freelancer/SearchFreelancer";
import MyJobs from "./pages/Freelancer/MyJobs";
import ProjectDetails from "./pages/Projects/ProjectDetails";
// import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Layout base */}
                <Route path="/" element={ <BasePage /> }>
                    {/* Rotas públicas */}
                    <Route index element={ <Home /> } />

                    {/* Rotas privadas (Quando tivermos a API para fazer o auth do usuário logado, irei encapsular essas tags marotas*/}
                    <Route path="/Profile" element={ <Profile /> } />
                    <Route path="/freelancers" element={ <Contracts /> } >
                        <Route path="/freelancers/searchFreelancers" element={ <SearchFreelancer /> }/>
                        <Route path="/freelancers/myJobs" element={ <MyJobs />  }/>
                    </Route>
                    <Route path="/projects" element={ <Projects /> } >
                        <Route path="/projects/searchProjects" element={ <SearchProjects />  }/>
                        <Route path="/projects/myProjects" element={ <MyProjects />  }/>
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                    </Route>

                    {/* Rota Fallback */}
                    <Route path="*" element={ <NotFound /> } />
                </Route>
                    <Route path="/login" element={ <Login /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;