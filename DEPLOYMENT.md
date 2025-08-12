# 🚀 Vercel Deployment Guide

This project is configured to deploy both the React frontend and Node.js backend on Vercel using serverless functions.

## ⚡ Quick Deploy

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

### Option 2: Deploy via GitHub
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration and deploy

## 📁 Project Structure

```
├── src/                    # React frontend
├── api/                    # Vercel serverless functions
│   └── jobs/
│       ├── run.js         # POST /api/jobs/run
│       └── [jobId].js     # GET /api/jobs/:jobId
├── vercel.json            # Vercel configuration
├── .env.example           # Environment variables template
└── dist/                  # Build output (auto-generated)
```

## ⚙️ Configuration

### Vercel Settings
The project is pre-configured with `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite (auto-detected)
- **Node.js Runtime**: 18.x

### Environment Variables
Set in Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | (leave empty) | API URL - auto-detects in production |

## 🏗️ Architecture

### Development Mode
- **Frontend**: `http://localhost:3000` (Vite dev server)
- **Backend**: `http://localhost:3002` (Express server)
- **Socket.IO**: ✅ Real-time updates enabled
- **Job Updates**: Live streaming via WebSocket

### Production Mode (Vercel)
- **Frontend**: `https://your-app.vercel.app` (Static site)
- **Backend**: `https://your-app.vercel.app/api/*` (Serverless functions)
- **Socket.IO**: ❌ Disabled (Vercel limitation)
- **Job Updates**: Simulated with timeouts

## 🔄 How It Works

### Local Development
1. Run `npm run dev:full` to start both frontend and backend
2. Frontend connects to backend via Socket.IO
3. Real-time job updates via WebSocket events
4. Full job execution simulation with live logs

### Production Deployment
1. Frontend builds to static files
2. Backend runs as Vercel serverless functions
3. No Socket.IO (serverless limitation)
4. Job execution simulated with frontend timeouts
5. Same UI experience, different underlying implementation

## 📋 API Endpoints

### POST `/api/jobs/run`
Start a new job execution
```json
{
  "inputFields": [
    {"field": "parameter1", "value": "value1"}
  ],
  "uploadedFiles": [
    {"id": "1", "name": "file.pdf", "size": 1024}
  ]
}
```

### GET `/api/jobs/:jobId`
Get job status and results
```json
{
  "id": "job_123",
  "status": "completed",
  "progress": 100,
  "results": { ... }
}
```

## 🚀 Deployment Steps

1. **Build Test**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Verify**
   - Check frontend loads correctly
   - Test job execution flow
   - Verify theme switching works
   - Check mobile responsiveness

## 🐛 Troubleshooting

### Build Fails
- Check TypeScript compilation: `npx tsc --noEmit`
- Verify all dependencies: `npm ci`
- Check environment variables

### API Errors
- View function logs in Vercel dashboard
- Check CORS configuration
- Verify request format

### Job Execution Issues
- Socket.IO disabled in production (expected)
- Jobs complete after 8 seconds (simulated)
- Check browser console for errors

## 🔗 Post-Deployment

1. **Test Functionality**
   - Job creation and execution
   - Theme switching (light/dark)
   - File upload simulation
   - Mobile navigation

2. **Optional Enhancements**
   - Set up custom domain
   - Configure analytics
   - Add monitoring
   - Set up CI/CD

## 📊 Performance

- **Frontend**: Static files served via Vercel Edge Network
- **API**: Serverless functions with automatic scaling
- **Bundle Size**: Optimized with Vite tree-shaking
- **Load Time**: Sub-second initial load

## 🔒 Security

- CORS properly configured
- Environment variables secure
- No sensitive data in client bundle
- Serverless functions isolated

---

**Ready to deploy!** 🎉

Your app will be available at: `https://your-project-name.vercel.app`