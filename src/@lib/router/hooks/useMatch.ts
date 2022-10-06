import { removeWrappedSeparator } from '../utils/path';
import { useLocation } from './useLocation';

/**
 * 현재 위치와 path 가 일치하는지 확인합니다
 *
 * 시작하는 구분자와 마지막 구분자 `/` 는 무시합니다
 */
export function useMatch(path: string) {
  const location = useLocation();

  return removeWrappedSeparator(location) === removeWrappedSeparator(path);
}
