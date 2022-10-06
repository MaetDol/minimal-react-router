/**
 * 맨 앞과 맨 뒤의 구분자 `/` 를 제거합니다
 */
export function removeWrappedSeparator(path: string) {
  return path.replace(/^\/|\/$/, '');
}
