# Job Runner Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- npm

## Installation
```bash
npm install
```

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Start the Mock Server:**
```bash
npm run server
```
The server will run on `http://localhost:3001`

**Terminal 2 - Start the React App:**
```bash
npm run dev
```
The React app will run on `http://localhost:3000`

### Option 2: Run Both Together (Recommended)
```bash
npm run dev:full
```
This will start both the mock server and React app simultaneously.

## Features

### ✅ **Completed Implementation**

1. **Functional Input Area with Validation**
   - Dynamic parameter input fields with real-time validation
   - Field name validation (letters, numbers, _, -)
   - Value validation (letters, numbers, _, -, @, #, /, {}, (), .)
   - File upload with drag & drop support
   - File type validation (CSV, XLSX, PDF, DOC)
   - File size limits (max 3MB per file, max 5 files)

2. **Job Execution Trigger**
   - "Run Job" button that triggers execution
   - Floating action button appears when all requirements are met
   - Real-time status updates

3. **Live Status Updates**
   - WebSocket connection for real-time updates
   - Status progression: Idle → Queued → Running → Completed
   - Live progress indicators with percentage
   - Toast notifications for status changes

4. **Terminal-Style Live Logs**
   - Real-time streaming logs with timestamps
   - Color-coded log types (info, success, error, warning)
   - Auto-scroll functionality
   - Copy logs to clipboard
   - Parameter and file information displayed in logs

5. **Results Display**
   - Comprehensive results view upon completion
   - Generated reports with download links
   - Metrics dashboard (files processed, parameters used, etc.)
   - Next steps recommendations

6. **Responsive Design**
   - Mobile-friendly interface
   - Collapsible sidebar navigation
   - Responsive grid layouts
   - Mobile navigation menu

### 🎯 **Bonus Features Implemented**

- **Progress Indicators**: Real-time progress bars and percentages
- **Error Handling**: Comprehensive validation and error messages  
- **Smooth Transitions**: Framer Motion animations throughout
- **Live Streaming Logs**: Real-time job execution logs
- **WebSocket Integration**: Live updates via Socket.IO
- **Mock Server**: Complete Express.js backend with job simulation

## Job Execution Flow

1. **Configure Parameters** - Add runtime parameters (optional)
2. **Upload Files** - Drag & drop required files
3. **Validate Configuration** - Ensure all required files are uploaded
4. **Execute Job** - Click Run button or floating action button
5. **Watch Live Updates** - View real-time logs and progress
6. **View Results** - Review generated reports and metrics

## Mock Data

The application simulates a "Due Diligence Check" job that:
- Processes uploaded financial documents
- Validates input parameters
- Generates IC (Investment Committee) documentation
- Creates compliance violation reports
- Provides risk scoring and analysis metrics

## API Endpoints

- `POST /api/jobs/run` - Start job execution
- `GET /api/jobs/:jobId` - Get job details
- `GET /api/jobs/:jobId/logs` - Get job logs

## WebSocket Events

- `job-status-update` - Job status changes
- `job-log` - New log entries
- `job-progress` - Progress updates
- `job-completed` - Job completion with results

## Architecture

- **Frontend**: React + TypeScript + Vite + TanStack Router
- **Backend**: Express.js + Socket.IO
- **UI**: Tailwind CSS + Shadcn/ui + Framer Motion
- **State**: Zustand + React Hook Form
- **Real-time**: Socket.IO WebSockets

The application demonstrates a complete job execution interface with live updates, comprehensive validation, and professional UI/UX design.