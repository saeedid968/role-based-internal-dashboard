import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth_Context";
import { sidebarConfig } from "../../utils/roles";

const Breadcrumbs = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const pathnames = location.pathname.split("/").filter(Boolean);
  const role = user.role;

  const basePath = `/${role}`;

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getLabel = (segment) => {
    const menuItem = sidebarConfig[role]?.find(
      (item) => item.path === segment
    );

    const label = menuItem?.label || segment.replace("-", " ");
    return capitalize(label);
  };

  const dashboardPath = `/${role}/dashboard`;


  return (
    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">

      {/* Role breadcrumb */}
      <NavLink
        to={dashboardPath}
        className="hover:text-primary capitalize font-medium"
      >
        {role}
      </NavLink>

      {pathnames.slice(1).map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`;
        const isLast = index === pathnames.length - 2;

        return (
          <div key={routeTo} className="flex items-center">
            <span className="material-symbols-outlined text-[16px] mx-2">
              chevron_right
            </span>

            {isLast ? (
              <span className="text-slate-900 dark:text-white font-medium">
                {getLabel(segment)}
              </span>
            ) : (
              <NavLink
                to={routeTo}
                className="hover:text-primary"
              >
                {getLabel(segment)}
              </NavLink>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
