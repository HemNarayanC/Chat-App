import { Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="text-orange-500 font-bold text-2xl">ChatApp</div>
      </div>

      {/* Right: Profile, Settings, Logout */}
      <div className="flex items-center space-x-6">
        {/* Profile */}
        <div className="flex items-center space-x-2 cursor-pointer hover:text-orange-500" title={authUser?.username}>
          <User size={20} />
          <span className="hidden md:inline" onClick={() => navigate('/profile')}>{authUser?.username || "User"}</span>
        </div>

        {/* Settings */}
        <div className="cursor-pointer hover:text-orange-500" title="Settings" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </div>

        {/* Logout */}
        <div className="cursor-pointer hover:text-orange-500" title="Logout" onClick={handleLogout}>
          <LogOut size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;