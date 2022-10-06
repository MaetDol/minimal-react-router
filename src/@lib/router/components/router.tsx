import React, { createContext, useEffect, useState } from 'react';
import {
  HistoryState,
  listenPopStateEvent,
  listenPushEvent,
} from '../utils/history';

interface Props extends React.PropsWithChildren {}

const DEFAULT_HISTORY_STATES = [window.history.state];
export const BrowserHistoryContext = createContext<HistoryState<any>[]>(
  DEFAULT_HISTORY_STATES
);

export function Router({ children }: Props) {
  const [history, setHistory] = useState<HistoryState<any>[]>(
    DEFAULT_HISTORY_STATES
  );

  useEffect(() => {
    const clearPushEventListener = listenPushEvent(setHistory);
    const clearPopStateEventListener = listenPopStateEvent(setHistory);

    return () => {
      clearPushEventListener();
      clearPopStateEventListener();
    };
  }, []);

  return (
    <BrowserHistoryContext.Provider value={history}>
      {children}
    </BrowserHistoryContext.Provider>
  );
}
