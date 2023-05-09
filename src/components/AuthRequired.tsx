import { Outlet, Navigate } from "react-router-dom";
import { User } from "firebase/auth";

const AuthRequired: React.FC<{ user: User | null }> = ({ user }) => {
  const userToken = localStorage.getItem('user-token')
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AuthRequired;
