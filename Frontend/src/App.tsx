import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParentRegistration from './components/register/ParentRegistration';
import FosterDashboard from './pages/foster/FosterDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import FosterPets from './pages/foster/FosterPets';
import FosterStore from './pages/foster/FosterStore';
import FosterParentLayout from './Layouts/FosterParentLayout';

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      //Registration Pages
      {
        path: 'parent-registration',
        element: <ParentRegistration />,
      },
      //Employee Pages
      {
        path: 'employee-page',
        element: <EmployeeDashboard />,
      },
    ],
  },
      //Foster Parent Pages
      {
    path: '/',
    element: <FosterParentLayout />,
    children: [
      //Foster Parent Pages
      {
        path: 'foster-page',
        element: <FosterDashboard />,
      },
      {
        path: 'foster-pets-page',
        element: <FosterPets />,
      },
      {
        path: 'foster-store-page',
        element: <FosterStore />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
