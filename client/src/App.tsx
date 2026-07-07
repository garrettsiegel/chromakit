import { Route, Switch, Redirect } from 'wouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import DocsPage from './pages/docs/DocsPage';

function App() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/docs">
          <Redirect to="/docs/getting-started" replace />
        </Route>
        <Route path="/docs/:slug" component={DocsPage} />
        <Route component={Home} />
      </Switch>
    </ErrorBoundary>
  );
}

export default App;
