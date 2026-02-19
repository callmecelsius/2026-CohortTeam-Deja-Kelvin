import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParentRegistration from './components/register/ParentRegistration';
import FosterDashboard from './pages/foster/FosterDashboard';
import FosterPets from './pages/foster/FosterPets';
import FosterStore from './pages/foster/FosterStore';
import FosterParentLayout from './Layouts/FosterParentLayout';
import EmployeeLayout from './Layouts/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeFosterParents from './pages/employee/EmployeeFosterParents';
import EmployeeInventory from './pages/employee/EmployeeInventory';
import EmployeePets from './pages/employee/EmployeePets';

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
      {
        path: 'employee-pets',
        element: <EmployeePets/>
      }
    ],
  },
  //Foster Parent Pages
  {
    path: '/',
    element: <FosterParentLayout />,
    children: [
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
  //Employee Pages
  {
    path: '/',
    element: <EmployeeLayout />,
    children: [
      {
        path: 'employee-page',
        element: <EmployeeDashboard />,
      },
      {
        path: 'employee-foster-parents-page',
        element: <EmployeeFosterParents />,
      },
      {
        path: 'employee-inventory-page',
        element: <EmployeeInventory />,
      },
      {
        path: 'employee-pets-page',
        element: <EmployeePets />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}