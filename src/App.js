import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from './404';
import './App.css';
import LandingScreen from './pages/landing/LandingScreen';
import LifestageScreen from './pages/lifestages/LifestageScreen';
import { palette } from './palette';

const App = () => {

  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingScreen />,
      errorElement: <Page404 />,
    }, {
      path: "stage/:stageId",
      element: <LifestageScreen />,
      errorElement: <Page404 />
    }
  ]);

  useEffect(() => {
    document.body.dataset.theme = 'light'
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="App" 
        role={'application'}
        style={{
          backgroundColor: palette.bg
        }}
      >
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
};

export default App;
