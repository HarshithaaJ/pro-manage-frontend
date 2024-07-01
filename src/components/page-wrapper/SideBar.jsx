import styles from "../css/SideBar.module.scss";
import {NavLink, useNavigate} from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiDatabase, FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5"
import LogoutPopup from "./LogoutPopup";
import { useAuth } from "../../context/user.context";

const navItems = [
    {
        name: "Board",
        route: "/dashboard",
        logo: <MdOutlineSpaceDashboard/>,
        key: "board"
      },
      {
        name: "Analytics",
        logo: <FiDatabase/>,
        route: "/analytics",
        key: "analytics"
      },
      {
        name: "Settings",
        logo: <FiSettings/>,
        route: "/settings",
        key: "settings"
    },
]

function SideBar({showPopupModal}) {

  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = ()=> {
    localStorage.removeItem("accessToken");
    logout();
    navigate("/login", {replace: true});
  }

  return (
    <section className={styles.sidebar}>
      <nav>
        <div className={styles.brand}>
          <h3>
            <span onClick={()=> navigate("/dashboard")}>
              <img src="logo.svg" alt="logo" /> Pro Manage
            </span>
          </h3>
        </div>
        <div className={styles.navitems}>
          <ul>
            {navItems.map((nav) => (
              <li key={nav.key}>
                  <NavLink
                    to={nav.route}
                    className={({ isActive }) =>
                      `${isActive ? styles.active : ""}`
                    }
                  >
                    <span>
                      {nav.logo}{nav.name}
                    </span>
                  </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.logout}>
          <p>
            <span onClick={()=> showPopupModal(LogoutPopup, {handleLogout})}>
              <IoLogOutOutline/> Log out
            </span>
          </p>
        </div>
      </nav>
    </section>
  );
}

export default SideBar