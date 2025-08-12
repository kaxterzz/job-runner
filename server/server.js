import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active jobs
const activeJobs = new Map();

// Job statuses
const JOB_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Mock job data
const generateMockLogs = (jobData) => {
  const { inputFields = [], uploadedFiles = [] } = jobData;
  
  const logs = [
    { timestamp: new Date().toISOString(), message: '🚀 Job execution started', type: 'info' },
    { timestamp: new Date().toISOString(), message: '📋 Initializing job runner...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '✅ Environment setup complete', type: 'success' }
  ];

  // Add parameter logs
  if (inputFields.length > 0) {
    logs.push({ timestamp: new Date().toISOString(), message: '📝 Processing input parameters...', type: 'info' });
    inputFields.forEach(param => {
      if (param.field && param.value) {
        logs.push({ 
          timestamp: new Date().toISOString(), 
          message: `   ├─ ${param.field}: ${param.value}`, 
          type: 'param' 
        });
      }
    });
  }

  // Add file upload logs
  if (uploadedFiles.length > 0) {
    logs.push({ timestamp: new Date().toISOString(), message: '📁 Processing uploaded files...', type: 'info' });
    uploadedFiles.forEach(file => {
      logs.push({ 
        timestamp: new Date().toISOString(), 
        message: `   ├─ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 
        type: 'file' 
      });
    });
  }

  // Add processing logs
  const processingLogs = [
    { timestamp: new Date().toISOString(), message: '⚙️  Starting due diligence analysis...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '🔍 Analyzing financial statements...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '📊 Processing market research data...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '🔗 Cross-referencing due diligence checks...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '📈 Generating investment committee documentation...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '✅ Analysis complete', type: 'success' },
    { timestamp: new Date().toISOString(), message: '📋 Generating final reports...', type: 'info' },
    { timestamp: new Date().toISOString(), message: '🎉 Job completed successfully!', type: 'success' }
  ];

  return [...logs, ...processingLogs];
};

// API Routes
app.post('/api/jobs/run', (req, res) => {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const jobData = req.body;
  
  const job = {
    id: jobId,
    status: JOB_STATUS.QUEUED,
    createdAt: new Date().toISOString(),
    data: jobData,
    logs: [],
    progress: 0
  };
  
  activeJobs.set(jobId, job);
  
  res.json({
    success: true,
    jobId: jobId,
    status: JOB_STATUS.QUEUED
  });

  // Start job execution simulation
  executeJobSimulation(jobId);
});

app.get('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json(job);
});

app.get('/api/jobs/:jobId/logs', (req, res) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json({ logs: job.logs });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('subscribe-to-job', (jobId) => {
    console.log(`Client ${socket.id} subscribed to job: ${jobId}`);
    socket.join(`job_${jobId}`);
  });

  socket.on('unsubscribe-from-job', (jobId) => {
    console.log(`Client ${socket.id} unsubscribed from job: ${jobId}`);
    socket.leave(`job_${jobId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Job execution simulation
async function executeJobSimulation(jobId) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  const mockLogs = generateMockLogs(job.data);
  let logIndex = 0;
  
  // Wait a bit before starting actual execution
  setTimeout(() => {
    // Update to running status
    job.status = JOB_STATUS.RUNNING;
    job.progress = 5;
    
    io.to(`job_${jobId}`).emit('job-status-update', {
      jobId,
      status: job.status,
      progress: job.progress
    });
  }, 2000); // Start running after 2 seconds

  // Simulate log streaming
  const logInterval = setInterval(() => {
    if (logIndex >= mockLogs.length) {
      clearInterval(logInterval);
      
      // Mark job as completed
      job.status = JOB_STATUS.COMPLETED;
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      
      // Generate mock results
      job.results = {
        summary: 'Due diligence analysis completed successfully',
        reports: [
          {
            name: 'IC_Document.pdf',
            type: 'Investment Committee Documentation',
            size: '2.4 MB',
            downloadUrl: '/mock/downloads/IC_Document.pdf'
          },
          {
            name: 'Violations_Report.pdf', 
            type: 'Compliance Violations Report',
            size: '1.8 MB',
            downloadUrl: '/mock/downloads/Violations_Report.pdf'
          }
        ],
        metrics: {
          filesProcessed: job.data.uploadedFiles?.length || 0,
          parametersUsed: job.data.inputFields?.length || 0,
          processingTime: '2m 34s',
          riskScore: '7.2/10'
        }
      };
      
      io.to(`job_${jobId}`).emit('job-status-update', {
        jobId,
        status: job.status,
        progress: job.progress,
        results: job.results
      });

      io.to(`job_${jobId}`).emit('job-completed', {
        jobId,
        results: job.results
      });
      
      return;
    }

    const currentLog = mockLogs[logIndex];
    job.logs.push(currentLog);
    
    // Update progress based on log index
    job.progress = Math.min(95, Math.floor((logIndex / mockLogs.length) * 90) + 5);
    
    // Emit log update
    io.to(`job_${jobId}`).emit('job-log', {
      jobId,
      log: currentLog,
      progress: job.progress
    });

    // Emit progress update
    io.to(`job_${jobId}`).emit('job-progress', {
      jobId,
      progress: job.progress,
      status: job.status
    });
    
    logIndex++;
  }, Math.random() * 1000 + 500); // Random delay between 500ms - 1500ms

  // Send initial queued message
  setTimeout(() => {
    const queuedLog = { 
      timestamp: new Date().toISOString(), 
      message: '⏳ Job queued successfully', 
      type: 'info' 
    };
    job.logs.push(queuedLog);
    io.to(`job_${jobId}`).emit('job-log', {
      jobId,
      log: queuedLog,
      progress: 0
    });
  }, 1000);
}

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time updates`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});