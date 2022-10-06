import { useMemo } from 'react';

/**
 * 현재 url의 서치 파라미터를 가져옵니다
 */
export function useQuery() {
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
  }, [location.search]);
}
