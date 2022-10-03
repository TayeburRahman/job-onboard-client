import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import auth from "../Firebase/Firebase.init";

const RequireAdmin = ({ children }) => {
  const [isAdmin, loading] = useAdmin();
  if (loading) return;
  if (!isAdmin) {
    signOut(auth).then(() => {
      toast.error(
        `We forcefully Sign Out You. Because you try to go Restricted Routes`
      );
      localStorage.removeItem("accessToken");
    });
    return <Navigate to="/login" state={{ from: "/dashboard" }} replace />;
  }
  return children;
};


export default RequireAdmin;