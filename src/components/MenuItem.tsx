import { NavLink } from "react-router-dom";
import { MenuItemProps } from "../types";

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/dashboard"}
        className={({ isActive }) =>
          `flex items-center p-2 w-full transition-colors duration-300 ${
            isActive ? "font-bold text-beige bg-redDark" : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default MenuItem;
