import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { SlArrowDown } from "react-icons/sl";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user-token");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header>
      <Link to="/">
        <div className="logo">FinTrack</div>
      </Link>
      <SlArrowDown
        aria-label="Menu"
        aria-expanded={isOpen}
        className={isOpen ? "menu-open" : "menu-close"}
        onClick={() => setIsOpen(!isOpen)}
      />
      <nav className={`text-center ${isOpen ? "show-menu" : ""}`}>
        <ul className="nav-list">
          <li className="nav-item" onClick={() => setIsOpen(false)}>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          <li className="nav-item" onClick={() => setIsOpen(false)}>
            <NavLink to="add">New</NavLink>
          </li>
          <li className="nav-item" onClick={() => setIsOpen(false)}>
            <NavLink to="entries">View</NavLink>
          </li>
          <li className="nav-item">
            <button className="logout" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
