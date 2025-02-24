import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { isAuthenticated } from "../utils/authHelpers";


const ConditionalLayout = () => {
  
  const isLoggedIn = isAuthenticated();
  console.log(isLoggedIn);

  return isLoggedIn ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Outlet />
  );
};

export default ConditionalLayout;
