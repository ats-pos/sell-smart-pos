import { useAuth } from '@/hooks/useAuth';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Save the attempted location for redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;