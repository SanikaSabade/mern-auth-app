import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;