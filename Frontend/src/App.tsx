import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParentRegistration from './components/register/ParentRegistration';
import FosterPage from './pages/FosterPage';

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
      {
        path: 'parent-registration',
        element: <ParentRegistration />,
      },
      {
        path: 'foster-page',
        element: <FosterPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
