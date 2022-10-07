import { Route, useQuery, useRouter } from '@router';
import { useEffect } from 'react';
import { About } from './components/About';
import { Root } from './components/Root';

export function App() {
  // 404 핸들링
  const { replace } = useRouter();
  const query = useQuery();
  useEffect(() => {
    if (!query.redirect) return;

    // 최초 진입시 동작안함 이벤트 리스너 등록이 안되서 그런 것 같음
    replace(decodeURIComponent(query.redirect));
  }, [query]);

  return (
    <>
      <Route path="/" component={<Root />} />
      <Route path="/about" component={<About />} />
    </>
  );
}
