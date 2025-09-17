import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Contract from "./pages/Contract";
import BasePage from "./pages/BasePage";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
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
                    <Route path="/contracts" element={ <PrivateRoute><Contract /></PrivateRoute> } />
                    <Route path="/Profile" element={ <PrivateRoute><Profile /></PrivateRoute> } />
                    <Route path="/projects" element={ <PrivateRoute><Projects /></PrivateRoute> } />

                    {/* Rota Fallback */}
                    <Route path="*" element={ <NotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;