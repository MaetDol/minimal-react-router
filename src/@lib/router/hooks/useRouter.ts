import { useCallback } from 'react';
import { dispatchPushEvent } from '../utils/history';

export function useRouter() {
  const push = useCallback(<T>(path: string, state?: T) => {
    dispatchPushEvent(path, state);
  }, []);

  return {
    push,
  };
}
