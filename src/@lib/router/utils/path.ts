import { globalHistoryState } from "./history";

/**
 * 맨 앞과 맨 뒤의 구분자 `/` 를 제거합니다
 */
export function removeWrappedSeparator(path: string) {
  return path.replace(/^\/|\/$/g, "");
}

export function resolveBasePath(path: string) {
  return (
    "/" +
    removeWrappedSeparator(globalHistoryState.base) +
    "/" +
    removeWrappedSeparator(path)
  );
}

export function removeBasePath(path: string) {
  const baseRegex = new RegExp(
    "^/?" + removeWrappedSeparator(globalHistoryState.base)
  );
  return removeWrappedSeparator(path).replace(baseRegex, "");
}
