import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import LandingScreen from './landing/LandingScreen';

const App = () => {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" role={'application'}>
        <LandingScreen />
      </div>
    </QueryClientProvider>
  );
};

export default App;
