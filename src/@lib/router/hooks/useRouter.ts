import { useCallback, useContext } from 'react';
import { BrowserHistoryContext } from '../components/router';
import { dispatchPushEvent, popHistory } from '../utils/history';

export function useRouter() {
  const push = useCallback(<T>(path: string, state?: T) => {
    dispatchPushEvent(path, state);
  }, []);

  const history = useContext(BrowserHistoryContext);
  const replace = useCallback(
    <T>(path: string, state?: T) => {
      popHistory(history);
      dispatchPushEvent(path, state);
    },
    [history]
  );

  return {
    push,
    replace,
  };
}
