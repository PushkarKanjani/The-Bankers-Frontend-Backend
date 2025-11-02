import { ApiCheckSafetyResponse, ApiRequestResourceResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const checkSafety = async (
  available: number[],
  allocation: number[][],
  max: number[][]
): Promise<ApiCheckSafetyResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/check-safety`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ available, allocation, max }),
  });

  if (!response.ok) {
    throw new Error('Failed to check safety');
  }

  return response.json();
};

export const requestResource = async (
  available: number[],
  allocation: number[][],
  max: number[][],
  requestingProcessID: string,
  requestAmount: number[]
): Promise<ApiRequestResourceResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/request-resource`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      available,
      allocation,
      max,
      requestingProcessID,
      requestAmount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to request resource');
  }

  return response.json();
};
