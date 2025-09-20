import React from "react";
import { useGateAccess } from "../hooks/useGateAccess";
import type { GateAccessEvent } from "../types/gate";

const GateMonitor: React.FC = () => {
  const { connectionStatus, events, connect, disconnect, clearEvents } =
    useGateAccess("1", "1");

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "access_granted":
        return "✅";
      case "access_denied":
        return "❌";
      case "exit_completed":
        return "🚪";
      case "test_broadcast":
        return "📡";
      default:
        return "📋";
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "access_granted":
        return "bg-green-50 border-green-200 text-green-800";
      case "access_denied":
        return "bg-red-50 border-red-200 text-red-800";
      case "exit_completed":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "test_broadcast":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gate Access Monitor
        </h2>
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getConnectionStatusColor(
              connectionStatus.status
            )}`}
          >
            {connectionStatus.status === "connected" && "🟢 Connected"}
            {connectionStatus.status === "connecting" && "🟡 Connecting..."}
            {connectionStatus.status === "disconnected" && "⚪ Disconnected"}
            {connectionStatus.status === "error" && "🔴 Error"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={connect}
              disabled={
                connectionStatus.status === "connected" ||
                connectionStatus.status === "connecting"
              }
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm"
            >
              Connect
            </button>
            <button
              onClick={disconnect}
              disabled={connectionStatus.status === "disconnected"}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm"
            >
              Disconnect
            </button>
            <button
              onClick={clearEvents}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Clear Events
            </button>
          </div>
        </div>
      </div>

      {connectionStatus.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Connection Error:</strong> {connectionStatus.error}
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Real-time Events ({events.length})
          </h3>
          <div className="text-sm text-gray-500">
            WebSocket: {connectionStatus.status}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📡</div>
            <p>No events received yet</p>
            <p className="text-sm">
              Connect to start monitoring gate access events
            </p>
          </div>
        ) : (
          events.map((event: GateAccessEvent, index: number) => (
            <div
              key={`${event.timestamp}-${index}`}
              className={`border rounded-lg p-4 ${getEventColor(
                event.event_type
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {getEventIcon(event.event_type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold capitalize">
                        {event.event_type.replace("_", " ")}
                      </span>
                      <span className="text-sm opacity-75">
                        Gate {event.gate_id} | Camera {event.camera_id}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{event.message}</p>
                    {event.access_result && (
                      <div className="text-xs opacity-75 space-y-1">
                        <div>
                          Access:{" "}
                          {event.access_result.access_granted
                            ? "✅ Granted"
                            : "❌ Denied"}
                          {event.access_result.access_id && (
                            <span> | ID: {event.access_result.access_id}</span>
                          )}
                        </div>
                        {event.access_result.similarity_score !== undefined && (
                          <div>
                            Similarity:{" "}
                            {(
                              event.access_result.similarity_score * 100
                            ).toFixed(1)}
                            %
                          </div>
                        )}
                        {event.access_result.processing_time_ms !==
                          undefined && (
                          <div>
                            Processing:{" "}
                            {event.access_result.processing_time_ms.toFixed(2)}
                            ms
                          </div>
                        )}
                        {event.access_result.transaction_id !== undefined && (
                          <div>
                            Transaction: {event.access_result.transaction_id}
                            {event.access_result.transaction_db_id && (
                              <span>
                                {" "}
                                (DB: {event.access_result.transaction_db_id})
                              </span>
                            )}
                          </div>
                        )}
                        {event.access_result.message && (
                          <div>Result: {event.access_result.message}</div>
                        )}
                        {event.access_result.transaction_completed !==
                          undefined && (
                          <div>
                            Transaction:{" "}
                            {event.access_result.transaction_completed
                              ? "✅ Completed"
                              : "❌ Failed"}
                          </div>
                        )}
                        {event.access_result.amount_deducted !== undefined && (
                          <div>
                            Amount Deducted:{" "}
                            {event.access_result.amount_deducted.toLocaleString()}{" "}
                            VND
                          </div>
                        )}
                        {event.access_result.new_wallet_balance !==
                          undefined && (
                          <div>
                            New Balance:{" "}
                            {event.access_result.new_wallet_balance.toLocaleString()}{" "}
                            VND
                          </div>
                        )}
                      </div>
                    )}
                    {event.user_id && (
                      <div className="text-xs opacity-75">
                        User ID: {event.user_id}
                      </div>
                    )}
                    {event.webhook_id && (
                      <div className="text-xs opacity-75">
                        Webhook ID: {event.webhook_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-75 text-right">
                  {formatTimestamp(event.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GateMonitor;
