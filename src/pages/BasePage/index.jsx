import { Outlet } from 'react-router';
import Header from '../../components/Header';
import Layout from '../../components/Layout';

function BasePage() {
    return (
        <>
            <Header />
            <Layout>
                <Outlet />
            </Layout>
        </>
    )
}

export default BasePage;