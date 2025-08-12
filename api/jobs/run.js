// Vercel serverless function for job execution
import cors from 'cors';

// Store active jobs (in production, use a database or Redis)
const activeJobs = new Map();

// Job statuses
const JOB_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// CORS middleware
const corsHandler = cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Wrapper to handle CORS
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Mock job data generation
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

export default async function handler(req, res) {
  // Handle CORS
  await runMiddleware(req, res, corsHandler);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Start job execution simulation (in background)
    executeJobSimulation(jobId);
  } catch (error) {
    console.error('Job execution error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start job execution' 
    });
  }
}

// Job execution simulation (simplified for serverless)
async function executeJobSimulation(jobId) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  const mockLogs = generateMockLogs(job.data);
  
  // Simulate job processing
  setTimeout(() => {
    job.status = JOB_STATUS.RUNNING;
    job.progress = 5;
  }, 2000);

  // Simulate completion after some time
  setTimeout(() => {
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
    
    job.logs = mockLogs;
  }, 10000); // Complete after 10 seconds
}