import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm py-3 px-6">
      {/* Left: navigation links */}
      <div className="flex gap-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/add" className="hover:text-blue-600">Add</Link>
        <Link to="/list" className="hover:text-blue-600">List</Link>
        <Link to="/circularity" className="hover:text-blue-600">Circularity</Link>
        <Link to="/report" className="hover:text-blue-600">Report</Link>
      </div>

      {/* Right: logout button */}
      <button
        onClick={handleLogout}
        className="text-sm font-semibold text-red-500 hover:text-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
