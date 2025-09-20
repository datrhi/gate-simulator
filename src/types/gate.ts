export interface GateAccessEvent {
  event_type:
    | "access_granted"
    | "access_denied"
    | "exit_completed"
    | "test_broadcast";
  gate_id: string;
  camera_id: string;
  user_id?: number;
  access_result?: {
    access_granted: boolean;
    access_id?: string;
    user_id?: number;
    similarity_score?: number;
    processing_time_ms?: number;
    transaction_id?: number | string;
    transaction_db_id?: number;
    message?: string;
    transaction_completed?: boolean;
    amount_deducted?: number;
    new_wallet_balance?: number;
  };
  message: string;
  timestamp: string;
  webhook_id?: string;
}

export interface WebSocketConnectionStatus {
  status: "connecting" | "connected" | "disconnected" | "error";
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TestBroadcastData {
  message: string;
  timestamp: string;
}

export interface GateAccessRequest {
  event_type: "access_granted" | "access_denied" | "exit_completed";
  gate_id: string;
  camera_id: string;
  user_id?: number;
  access_result?: {
    status: "success" | "failed";
    confidence?: number;
    reason?: string;
  };
  message: string;
}
