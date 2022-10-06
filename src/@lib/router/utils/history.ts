import React from 'react';
import { peek } from './utils';

export type HistoryState<T> = {
  state?: T;
  timestamp: number;
  navigateTo: string;
};

export interface PushEvent<T> extends Event {
  detail: HistoryState<T>;
}

/**
 * pushstate 이벤트를 발생시킵니다
 */
export function dispatchPushEvent<T>(path: string, state?: T) {
  const timestamp = Date.now();
  const event = new CustomEvent<HistoryState<T>>('pushstate', {
    cancelable: true,
    detail: {
      state: state,
      timestamp: timestamp,
      navigateTo: path,
    },
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
  history.pushState(historyState, '', path);
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
  if (!history.length) return true;

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
    setHistory((prev) => prev.concat(e.detail));
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
      console.log(e);
      e.preventDefault();
      if (!isPopStateEvent(e)) return history;
      if (isForwardEvent(e, history)) return history.concat(e.state);
      return history.slice(0, -1);
    });

  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}
