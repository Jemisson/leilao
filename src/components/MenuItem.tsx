import { NavLink } from "react-router-dom";
import { MenuItemProps } from "../types";

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label, onClick }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/dashboard"}
        onClick={onClick}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
            isActive
              ? "bg-pinkDark text-white shadow-sm"
              : "text-gray-700 hover:bg-blueBright/10 hover:text-blueBright"
          }`
        }
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default MenuItem;
