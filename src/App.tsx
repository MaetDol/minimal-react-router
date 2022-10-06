import { Route, Router, useQuery, useRouter } from '@router';
import { useEffect } from 'react';
import { About } from './components/About';
import { Root } from './components/Root';

export function App() {
  // 404 핸들링
  const { push } = useRouter();
  const query = useQuery();
  useEffect(() => {
    if (!query.redirect) return;

    push(decodeURIComponent(query.redirect));
  }, [query]);

  return (
    <Router>
      <Route path="/" component={<Root />} />
      <Route path="/about" component={<About />} />
    </Router>
  );
}
