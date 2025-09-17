import { Outlet } from 'react-router';
import Header from '../../components/Header';

function BasePage() {
    return (
        <main>
            <Header />
            <Outlet />
        </main>
    )
}

export default BasePage;