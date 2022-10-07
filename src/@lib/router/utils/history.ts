import React from 'react';
import { peek } from './utils';

export const SESSION_STORAGE_HISTORY_KEY = '__history';

export type HistoryState<T> = {
  state?: T;
  timestamp: number;
  navigateTo: string;
};

export interface PushEvent<T> extends Event {
  detail: HistoryState<T>;
}

/**
 * HistoryState 를 만들어주는 함수입니다
 */
export function getHistoryState<T>(
  navigateTo: string,
  state?: T,
  timestamp = Date.now()
) {
  return {
    state,
    timestamp,
    navigateTo,
  };
}

/**
 * pushstate 이벤트를 발생시킵니다
 */
export function dispatchPushEvent<T>(path: string, state?: T) {
  const timestamp = Date.now();
  const event = new CustomEvent<HistoryState<T>>('pushstate', {
    cancelable: true,
    detail: getHistoryState(path, state),
  });

  // preventDefault 가 실행됐다면, 중단합니다
  const cancelled = !window.dispatchEvent(event);
  if (cancelled) return;

  // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
  // 두번째 인자는 하위호환성에 때문에 빈 문자열로 채워넣었어요
  const historyState: HistoryState<any> = {
    state,
    timestamp,
    navigateTo: path,
  };
  window.history.pushState(historyState, '', path);
}

/**
 * PushEvent 타입가드입니다
 */
export function isPushEvent<T>(event: any): event is PushEvent<T> {
  return (
    'detail' in event &&
    'state' in event.detail &&
    'timestamp' in event.detail &&
    'navigateTo' in event.detail
  );
}

/**
 * PopStateEvent 타입가드입니다
 */
export function isPopStateEvent(event: Event): event is PopStateEvent {
  return 'state' in event;
}

/**
 * 앞으로가기 버튼 이벤트인지 확인합니다
 */
export function isForwardEvent(
  event: PopStateEvent,
  history: HistoryState<any>[]
) {
  if (!history.length) {
    throw new Error('history 는 비어있을 수 없습니다');
  }

  return event.state?.timestamp > peek(history).timestamp;
}

type SetHistoryState = React.Dispatch<
  React.SetStateAction<HistoryState<any>[]>
>;
/**
 * pushstate 이벤트 리스너를 등록하고, 이벤트 리스너 리무브 함수를 반환합니다
 */
export function listenPushEvent(setHistory: SetHistoryState) {
  const handler = (e: Event) => {
    if (!isPushEvent<any>(e)) return;
    setHistory((history) => pushHistory(e.detail, history));
  };

  window.addEventListener('pushstate', handler);
  return () => window.removeEventListener('pushstate', handler);
}

/**
 * popState 이벤트 리스너를 등록하고, 이벤트 리스너 리무브 함수를 반환합니다
 */
export function listenPopStateEvent(setHistory: SetHistoryState) {
  const handler = (e: Event) =>
    setHistory((history) => {
      e.preventDefault();
      console.log(e, history);

      if (!isPopStateEvent(e)) {
        return saveHistory(history);
      }

      // 앞으로 가기라면, 히스토리에 추가합니다
      if (isForwardEvent(e, history)) {
        return pushHistory(e.state, history);
      }

      // 뒤로가기라면, 마지막 하나를 제거합니다
      return saveHistory(history.slice(0, -1));
    });

  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}

/**
 * 히스토리를 추가하는 함수에요
 *
 * 같은 URL 로 재접근시 history 에 추가하지 않기 때문에, 예외처리를 위해 함수를 만들었어요
 *
 * 이벤트를 dispatch 하지 않습니당
 */
export function pushHistory<T>(
  newState: HistoryState<T>,
  history: HistoryState<T>[]
) {
  if (peek(history)?.navigateTo === newState.navigateTo) return history;

  return saveHistory(history.concat(newState));
}

/**
 * 히스토리 맨 위를 제거하는 함수에요
 *
 * 이벤트를 dispatch 하지 않습니당
 */
export function popHistory<T>(history: HistoryState<T>[]) {
  const poped = history.pop();
  saveHistory(history);
  return poped;
}

/**
 * history 를 세션스토리지에 저장해주는 함수에요
 */
export function saveHistory(history: HistoryState<any>[]) {
  // TODO: 순환참조가 있다면 에러가 생길 수 있어요
  sessionStorage.setItem(SESSION_STORAGE_HISTORY_KEY, JSON.stringify(history));
  return history;
}

/**
 * 페이지가 열렸을때, 초기화에 사용될 히스토리를 세션 스토리지에서 가져옵니다
 */
export function getInitialHistory() {
  const storedHistory: HistoryState<any>[] = JSON.parse(
    sessionStorage.getItem(SESSION_STORAGE_HISTORY_KEY) ?? 'null'
  );

  // 해당 라우터의 히스토리 사이즈는 history.length 보다 길 수 없어서, 다음과 같이 처리했어요
  // 맨 뒤에서부터, history.length 만큼만 가져옵니다
  const fittedHistory = (storedHistory ?? []).slice(-history.length);

  return pushHistory(getHistoryState(window.location.pathname), fittedHistory);
}
