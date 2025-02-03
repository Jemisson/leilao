import React, { useEffect, useState } from "react";
import ActionCable from "actioncable";
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketContextProps } from "../types";

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cable, setCable] = useState<WebSocketContextProps["cable"]>(null);

  useEffect(() => {
    const ws = ActionCable.createConsumer("ws://localhost:3000/cable");
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
