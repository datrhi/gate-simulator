import React, { useEffect, useState } from "react";
import type { GateAccessEvent } from "../types/gate";
import { eventBus, EventNames } from "../utils/eventBus";

interface GateProps {
  gateId: string;
  cameraId: string;
  autoCloseAfter: number;
}

const Gate: React.FC<GateProps> = ({
  gateId,
  cameraId,
  autoCloseAfter = 3000,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const callback = (event: GateAccessEvent) => {
      if (event.gate_id === gateId) {
        if (event.event_type === "access_granted") {
          setIsOpen(true);
        } else if (
          event.event_type === "access_denied" ||
          event.event_type === "exit_completed"
        ) {
          setIsOpen(false);
        }
      }
    };
    eventBus.addListener(EventNames.GATE_EVENT, callback);

    return () => {
      eventBus.removeListener(EventNames.GATE_EVENT, callback);
    };
  }, [gateId]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, autoCloseAfter);
    }
  }, [isOpen, autoCloseAfter]);

  // Xử lý events để điều khiển cửa

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Gate Sign and Camera Container */}
      <div className="flex items-center space-x-4">
        {/* Gate Sign */}
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-lg">
          CỔNG SỐ {gateId}
        </div>

        {/* Camera */}
        <div className="flex flex-col items-center space-y-2">
          {/* Camera Body */}
          <div className="w-16 h-12 bg-gray-800 rounded-lg shadow-lg border-2 border-gray-600 relative">
            {/* Camera Lens */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-2 border-gray-400">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            {/* Camera Mount */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>

          {/* Camera ID */}
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium">
            Camera {cameraId}
          </div>
        </div>
      </div>

      {/* Gate Structure */}
      <div className="relative">
        {/* Gate Frame */}
        <div className="w-80 h-48 bg-gray-800 rounded-lg shadow-2xl border-4 border-gray-600 relative overflow-hidden">
          {/* Gate Doors */}
          <div className="absolute inset-0 flex">
            {/* Left Door */}
            <div
              className={`w-1/2 h-full bg-blue-600 transition-transform duration-500 ease-in-out transform origin-left ${
                isOpen ? "-translate-x-full" : "translate-x-0"
              }`}
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                boxShadow: isOpen
                  ? "none"
                  : "inset -5px 0 15px rgba(0,0,0,0.3)",
              }}
            >
              {/* Door Handle */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-yellow-400 rounded-full shadow-lg"></div>
              {/* Door Panel Lines */}
              <div className="absolute left-3 top-3 w-6 h-1 bg-blue-300 rounded"></div>
              <div className="absolute left-3 top-6 w-6 h-1 bg-blue-300 rounded"></div>
              <div className="absolute left-3 top-9 w-6 h-1 bg-blue-300 rounded"></div>
            </div>

            {/* Right Door */}
            <div
              className={`w-1/2 h-full bg-blue-600 transition-transform duration-500 ease-in-out transform origin-right ${
                isOpen ? "translate-x-full" : "translate-x-0"
              }`}
              style={{
                background: "linear-gradient(225deg, #1e40af 0%, #3b82f6 100%)",
                boxShadow: isOpen ? "none" : "inset 5px 0 15px rgba(0,0,0,0.3)",
              }}
            >
              {/* Door Handle */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-yellow-400 rounded-full shadow-lg"></div>
              {/* Door Panel Lines */}
              <div className="absolute right-3 top-3 w-6 h-1 bg-blue-300 rounded"></div>
              <div className="absolute right-3 top-6 w-6 h-1 bg-blue-300 rounded"></div>
              <div className="absolute right-3 top-9 w-6 h-1 bg-blue-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Gate Base */}
        <div className="w-full h-3 bg-gray-700 rounded-b-lg shadow-lg"></div>
      </div>
    </div>
  );
};

const MultiGateUI: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [globalAutoCloseTime, setGlobalAutoCloseTime] = useState(3000);
  const [gateCount, setGateCount] = useState(3);

  const handleGlobalAutoCloseChange = (newTime: number) => {
    setGlobalAutoCloseTime(newTime);
  };

  const handleGateCountChange = (newCount: number) => {
    setGateCount(newCount);
  };

  const toggleConfig = () => {
    if (isConfigOpen) {
      // Closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsConfigOpen(false);
        setIsAnimating(false);
      }, 300); // Match with CSS transition duration
    } else {
      // Opening - start with animation state
      setIsConfigOpen(true);
      setIsAnimating(true);
      // Trigger opening animation after a brief delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 10);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hệ Thống Cổng Tàu Điện
          </h1>
          <p className="text-gray-600">
            {gateCount} Cổng và {gateCount} Camera Giám Sát
          </p>
        </div>

        {/* Config Button */}
        <button
          onClick={toggleConfig}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Cấu hình</span>
        </button>
      </div>

      {/* Gates Container */}
      <div
        className={`grid grid-cols-1 ${
          gateCount <= 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } gap-8 max-w-7xl mx-auto`}
      >
        {Array.from({ length: gateCount }, (_, index) => (
          <Gate
            key={index + 1}
            gateId={(index + 1).toString()}
            cameraId={(index + 1).toString()}
            autoCloseAfter={globalAutoCloseTime}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-sm text-gray-600 max-w-2xl mx-auto">
        <p>
          Mỗi cổng sẽ tự động mở khi camera nhận diện khuôn mặt và đóng lại sau
          {globalAutoCloseTime / 1000} giây. Cổng sẽ đóng ngay lập tức khi có
          yêu cầu đặc biệt.
        </p>
      </div>

      {/* Bottom Sheet Config Menu */}
      {(isConfigOpen || isAnimating) && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            isConfigOpen && !isAnimating
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop - lighter and more transparent with blur */}
          <div
            className={`absolute inset-0 bg-black bottom-sheet-backdrop transition-opacity duration-300 ${
              isConfigOpen && !isAnimating ? "bg-opacity-20" : "bg-opacity-0"
            }`}
            onClick={toggleConfig}
          ></div>

          {/* Bottom Sheet */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl bottom-sheet transform transition-transform duration-300 ease-out ${
              isConfigOpen && !isAnimating
                ? "translate-y-0"
                : "translate-y-full"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Cấu hình hệ thống
                </h2>
                <button
                  onClick={toggleConfig}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Config Content */}
              <div className="space-y-6">
                {/* Global Auto Close Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Thời gian tự động đóng cửa (giây)
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">
                        Tất cả các cổng
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={globalAutoCloseTime / 1000}
                        onChange={(e) =>
                          handleGlobalAutoCloseChange(
                            parseFloat(e.target.value) * 1000
                          )
                        }
                        className="w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="w-16 text-center font-mono text-sm bg-white px-2 py-1 rounded border">
                        {globalAutoCloseTime / 1000}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gate Count */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Số lượng cổng hiển thị
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Số cổng</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={gateCount}
                        onChange={(e) =>
                          handleGateCountChange(parseInt(e.target.value))
                        }
                        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="w-16 text-center font-mono text-sm bg-white px-2 py-1 rounded border">
                        {gateCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={toggleConfig}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      // Reset to default values
                      setGlobalAutoCloseTime(3000);
                      setGateCount(3);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đặt lại mặc định
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiGateUI;
