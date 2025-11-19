import { Outlet } from 'react-router';
import Header from '../../components/Header';
import { useAuth } from '../../context/authContext';
import AuthLoadingScreen from '../../components/ui/AuthLoadingScreen';

function BasePage() {
    const { loading } = useAuth();

    if (loading) return <AuthLoadingScreen />

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default BasePage;