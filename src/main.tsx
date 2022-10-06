import { Route, Router } from '@router';
import ReactDOM from 'react-dom/client';
import { About } from './components/About';
import { Root } from './components/Root';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
