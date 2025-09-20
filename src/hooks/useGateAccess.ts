import { useEffect, useRef, useState } from "react";
import type { GateAccessEvent, WebSocketConnectionStatus } from "../types/gate";
import { eventBus, EventNames } from "../utils/eventBus";

const WEBSOCKET_URL = "ws://abt.nopales.tech/api/v1/webhook/ws";

export const useGateAccess = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>({
      status: "disconnected",
    });
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus({ status: "connecting" });

    try {
      const ws = new WebSocket(WEBSOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus({ status: "connected" });
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Check if this is a direct gate access event (new format)
          if (message.event_type && message.gate_id && message.camera_id) {
            const gateEvent: GateAccessEvent = {
              event_type: message.event_type,
              gate_id: message.gate_id,
              camera_id: message.camera_id,
              user_id: message.user_id,
              access_result: message.access_result,
              message: message.message,
              timestamp: message.timestamp || new Date().toISOString(),
              webhook_id: message.webhook_id,
            };
            eventBus.emit(EventNames.GATE_EVENT, gateEvent);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setConnectionStatus({ status: "disconnected" });

        // Attempt to reconnect
        // if (reconnectAttempts.current < maxReconnectAttempts) {
        //   reconnectAttempts.current++;
        //   const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);

        //   reconnectTimeoutRef.current = setTimeout(() => {
        //     console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        //     connect();
        //   }, delay);
        // } else {
        //   setConnectionStatus({
        //     status: 'error',
        //     error: 'Max reconnection attempts reached'
        //   });
        // }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus({
          status: "error",
          error: "Connection error occurred",
        });
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionStatus({
        status: "error",
        error: "Failed to create connection",
      });
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionStatus({ status: "disconnected" });
    reconnectAttempts.current = 0;
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();
    console.log("connect");

    return () => {
      disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionStatus,
    connect,
    disconnect,
  };
};
