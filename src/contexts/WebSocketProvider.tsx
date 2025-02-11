import React, { useEffect, useState } from "react";
import ActionCable from "actioncable";
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketContextProps } from "../types";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cable, setCable] = useState<WebSocketContextProps["cable"]>(null);

  useEffect(() => {
    const ws = ActionCable.createConsumer(WEBSOCKET_URL);
    setCable(ws);

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ cable }}>
      {children}
    </WebSocketContext.Provider>
  );
};
