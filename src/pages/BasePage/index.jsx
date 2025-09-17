import { Outlet } from 'react-router';
import Header from '../../components/Header';

function BasePage() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default BasePage;