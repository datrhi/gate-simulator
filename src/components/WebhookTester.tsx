import React, { useState } from "react";
import { webhookService } from "../services/webhookService";
import type { ApiResponse } from "../types/gate";

const WebhookTester: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [testMessage, setTestMessage] = useState("Hello from React!");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [gateId, setGateId] = useState("1");
  const [cameraId, setCameraId] = useState("1");

  const handleTestBroadcast = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await webhookService.testBroadcast(testMessage);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendAccessEvent = async (
    eventType: "access_granted" | "access_denied" | "exit_completed"
  ) => {
    setLoading(true);
    setResult(null);

    try {
      const eventData = {
        event_type: eventType,
        gate_id: gateId,
        camera_id: cameraId,
        user_id: Math.floor(Math.random() * 1000) + 1,
        access_result: {
          status: eventType === "access_granted" ? "success" : "failed",
          confidence: Math.floor(Math.random() * 40) + 60,
          reason:
            eventType === "access_denied" ? "Face not recognized" : undefined,
        },
        message: `Manual ${eventType.replace("_", " ")} event`,
      };

      const response = await webhookService.sendGateAccessEvent(eventData);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerGateAccess = async () => {
    if (!selectedImage) {
      setResult({
        success: false,
        error: "Please select an image file first",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await webhookService.triggerGateAccess(
        selectedImage,
        gateId,
        cameraId
      );
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Webhook Tester</h2>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gate ID
          </label>
          <input
            type="text"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter gate ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Camera ID
          </label>
          <input
            type="text"
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter camera ID"
          />
        </div>
      </div>

      {/* Test Broadcast */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Test Broadcast
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter test message"
          />
          <button
            onClick={handleTestBroadcast}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Sending..." : "Test Broadcast"}
          </button>
        </div>
      </div>

      {/* Manual Event Triggers */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Manual Event Triggers
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleSendAccessEvent("access_granted")}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            Send Access Granted
          </button>

          <button
            onClick={() => handleSendAccessEvent("access_denied")}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            Send Access Denied
          </button>

          <button
            onClick={() => handleSendAccessEvent("exit_completed")}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            Send Exit Completed
          </button>
        </div>
      </div>

      {/* Gate Access Trigger */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Trigger Gate Access
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTriggerGateAccess}
            disabled={loading || !selectedImage}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Processing..." : "Trigger Access"}
          </button>
        </div>
        {selectedImage && (
          <p className="text-sm text-gray-600">
            Selected: {selectedImage.name} (
            {(selectedImage.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div
          className={`p-4 rounded-md ${
            result.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <h3 className="font-medium mb-2">
            {result.success ? "✅ Success" : "❌ Error"}
          </h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(
              result.success ? result.data : result.error,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WebhookTester;
