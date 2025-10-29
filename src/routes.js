import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Contracts from "./pages/Contracts";
import BasePage from "./pages/BasePage";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Login from "./pages/Auth/Login";
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
                    <Route path="/contracts" element={ <Contracts /> } />
                    <Route path="/Profile" element={ <Profile /> } />
                    <Route path="/projects" element={ <Projects /> } />

                    {/* Rota Fallback */}
                    <Route path="*" element={ <NotFound /> } />
                </Route>
                    <Route path="/login" element={ <Login /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;