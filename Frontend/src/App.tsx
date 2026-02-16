import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParentRegistration from './components/register/ParentRegistration';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router= createBrowserRouter(
  [
    {
      path:"/",
      element:<div><NavBar /><HomePage /><Footer/></div>

    },
    {
      path:"/parent-registration",
      element:<div><NavBar /><ParentRegistration/><Footer/></div>
    }

  ]
);
export default function App() {
  return (
    <>
    <RouterProvider router={router}/>
    
    </>
  );
}