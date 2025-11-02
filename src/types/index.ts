export interface AuditLog {
  timestamp: string;
  message: string;
}

export interface SafetyStatus {
  status: 'safe' | 'unsafe' | 'pending';
  sequence: string[];
  message: string;
}

export interface ApiCheckSafetyResponse {
  safe: boolean;
  sequence: string[];
  message: string;
}

export interface ApiRequestResourceResponse {
  granted: boolean;
  message: string;
  newAllocation?: number[][];
  newAvailable?: number[];
}
