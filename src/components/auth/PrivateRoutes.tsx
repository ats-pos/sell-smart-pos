import { useAuth } from '@/hooks/useAuth';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        true ? <Outlet /> : <Navigate to="/login" />
    );
};

export default PrivateRoutes;