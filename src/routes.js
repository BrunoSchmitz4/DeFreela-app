import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Contract from "./pages/Contract";
import BasePage from "./pages/BasePage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <BasePage /> }>
                    <Route index element={ <Home /> } />
                    <Route path="/contracts" element={ <Contract /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;