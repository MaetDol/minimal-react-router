import { useCallback, useContext } from 'react';
import { BrowserHistoryContext } from '../components/router';
import { dispatchPushEvent, popHistory } from '../utils/history';
import { removeWrappedSeparator } from '../utils/path';
import { peek } from '../utils/utils';

export function useRouter() {
  const push = useCallback(<T>(path: string, state?: T) => {
    dispatchPushEvent(path, state);
  }, []);

  const history = useContext(BrowserHistoryContext);
  const replace = useCallback(
    <T>(path: string, state?: T) => {
      popHistory(history);

      const lastState = peek(history);
      const isSamePath =
        removeWrappedSeparator(lastState?.navigateTo ?? '') ===
        removeWrappedSeparator(path);
      if (isSamePath) popHistory(history);

      dispatchPushEvent(path, state);
    },
    [history]
  );

  return {
    push,
    replace,
  };
}
