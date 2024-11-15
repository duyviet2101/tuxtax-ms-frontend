import {useContext} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const {isAuthenticated} = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to={"/auth/login"} />;
}