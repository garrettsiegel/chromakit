import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';

function App() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}

export default App;
