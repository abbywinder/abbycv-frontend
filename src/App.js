import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import LandingScreen from './landing/LandingScreen';
import { palette } from './palette';

const App = () => {

  const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="App" 
        role={'application'}
        style={{
          backgroundColor: palette.bg
        }}
      >
        <LandingScreen />
      </div>
    </QueryClientProvider>
  );
};

export default App;
