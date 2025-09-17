import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";
import Contract from "./pages/Contract";
import BasePage from "./pages/BasePage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <BasePage /> }>
                    <Route index element={ <Main /> } />
                    <Route path="/contracts" element={ <Contract /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;