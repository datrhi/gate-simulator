import type { ApiResponse, TestBroadcastData, GateAccessRequest } from '../types/gate';

const API_BASE_URL = 'http://abt.nopales.tech/api/v1';

class WebhookService {
  async testBroadcast(message: string): Promise<ApiResponse<TestBroadcastData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/webhook/test-broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendGateAccessEvent(eventData: GateAccessRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/webhook/gate-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async triggerGateAccess(
    faceImage: File, 
    gateId: string = '', 
    cameraId: string = ''
  ): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('face_images', faceImage);
      formData.append('gate_id', gateId);
      formData.append('camera_id', cameraId);

      const response = await fetch(`${API_BASE_URL}/gates/access`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const webhookService = new WebhookService();
