import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  getInitialHistory,
  HistoryState,
  globalHistoryState,
  listenPopStateEvent,
  listenPushEvent,
} from "../utils/history";

interface Props extends React.PropsWithChildren {
  base?: string;
}

export const BrowserHistoryContext = createContext<HistoryState<any>[]>([]);

export function Router({ children, base = "" }: Props) {
  globalHistoryState.base = base;
  const initialHistory = useMemo(() => getInitialHistory(), []);
  const [history, setHistory] = useState<HistoryState<any>[]>(initialHistory);

  useEffect(() => {
    const clearPushEventListener = listenPushEvent(setHistory);
    const clearPopStateEventListener = listenPopStateEvent(setHistory);

    if (globalHistoryState.current) dispatchEvent(globalHistoryState.current);

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
