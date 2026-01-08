import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">🏥 Vet Clinic Management</span>
        <div className="d-flex align-items-center">
          <span className="text-white me-3">
            <strong>{user?.fullName || user?.username}</strong>
            <span className="badge bg-light text-primary ms-2">{user?.role}</span>
          </span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
