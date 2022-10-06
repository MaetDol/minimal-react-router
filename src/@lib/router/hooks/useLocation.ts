import { useContext } from 'react';
import { BrowserHistoryContext } from '../components/router';
import { peek } from '../utils/utils';

/**
 * 현재 pathname을 반환합니다
 */
export function useLocation() {
  const history = useContext(BrowserHistoryContext);

  return peek(history)?.navigateTo ?? window.location.pathname;
}
