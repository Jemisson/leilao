import { createContext } from "react";
import { WebSocketContextProps } from "../types";

export const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);
