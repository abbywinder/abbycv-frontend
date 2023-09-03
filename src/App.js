import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { checkAuth } from './utils/functions';
import ErrorPage from './components/ErrorPage';
import LandingScreen from './pages/landing/LandingScreen';
import LifestageScreen from './pages/lifestages/LifestageScreen';
import Login from './pages/login/Login';
import Page404 from './404';
import './App.css';

const App = () => {

  const authorized = checkAuth();

  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingScreen />,
      errorElement: <ErrorPage />,
    }, {
      path: "stage/:stageId",
      element: <LifestageScreen />,
      errorElement: <ErrorPage />,
    }, {
      path: "login",
      element: <Login />,
      errorElement: <ErrorPage />,
    }, {
      path: '*',
      element: <Page404 />
    }
  ]);

  useEffect(() => {
    if (!document.body.dataset.theme) document.body.dataset.theme = 'light';
  },[]);

  if (!authorized) {
    return <Login />
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <div role={'application'} className='app'>
          <RouterProvider router={router} />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
