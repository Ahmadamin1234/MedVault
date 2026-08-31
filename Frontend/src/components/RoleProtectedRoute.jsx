import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";

export default function RoleProtectedRoute({ page }) {
  const location = useLocation();
  const context = useOutletContext();

  const currentUser = context?.currentUser;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const allowedPages = currentUser.pages || [];

  if (!allowedPages.includes(page)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet context={context} />;
}