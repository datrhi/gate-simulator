# Gate Access Simulator

A React frontend application for monitoring and testing gate access events in real-time using WebSocket connections.

## Features

- **Real-time Monitoring**: WebSocket connection to receive live gate access events
- **Event Display**: Visual display of access granted, denied, exit completed, and test broadcast events
- **Manual Testing**: Send test events and trigger gate access manually
- **Connection Management**: Connect/disconnect WebSocket with automatic reconnection
- **Responsive UI**: Modern interface built with Tailwind CSS

## WebSocket Connection

The application connects to: `ws://abt.nopales.tech/api/v1/webhook/ws`

## API Endpoints

- **Test Broadcast**: `POST http://localhost:8000/api/v1/webhook/test-broadcast`
- **Gate Access Event**: `POST http://localhost:8000/api/v1/webhook/gate-access`
- **Trigger Gate Access**: `POST http://localhost:8000/api/v1/gates/access`

## Event Types

- `access_granted` - Successful gate access
- `access_denied` - Failed gate access
- `exit_completed` - User exited through gate
- `test_broadcast` - Test message broadcast

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Monitor Events**: The Gate Monitor will automatically connect to the WebSocket and display real-time events

3. **Test Webhooks**: Use the Webhook Tester to:
   - Send test broadcast messages
   - Trigger manual access events
   - Upload images to test gate access

## Components

- `GateMonitor`: Real-time event display with WebSocket connection management
- `WebhookTester`: Manual testing interface for webhook endpoints
- `useGateAccess`: Custom hook for WebSocket connection and event handling

## Technologies

- React 19 with TypeScript
- Tailwind CSS for styling
- WebSocket API for real-time communication
- Vite for development and building