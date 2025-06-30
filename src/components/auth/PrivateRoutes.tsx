import { useAuth } from '@/hooks/useAuth';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return (
        isAuthenticated ? children : <Navigate to="/login" />
    );
};

export default PrivateRoutes;
