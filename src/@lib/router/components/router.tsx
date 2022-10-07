import React, { createContext, useEffect, useState } from "react";
import {
  getInitialHistory,
  HistoryState,
  lastHistoryPushEvent,
  listenPopStateEvent,
  listenPushEvent,
} from "../utils/history";

interface Props extends React.PropsWithChildren {}

const DEFAULT_HISTORY_STATES: HistoryState<any>[] = getInitialHistory();
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

    if (lastHistoryPushEvent.current)
      dispatchEvent(lastHistoryPushEvent.current);

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
