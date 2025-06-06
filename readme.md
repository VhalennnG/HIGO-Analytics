# HIGO Analytics Dashboard

![Dashboard Overview](/images/1.png)  
*Main dashboard showing customer data summary*

![Data Details](/images/2.png)  
*Detailed customer data table view*

## Overview

This project provides a comprehensive solution for analyzing and visualizing customer data with:

- **Backend**: Node.js/Express.js hosted on Render
- **Frontend**: Next.js hosted on Vercel  
- **Database**: MongoDB Atlas

## Features

- 📊 **Interactive Visualizations**: Gender distribution and location analysis charts
- ♀️♂️ **Demographic Insights**: Age statistics and customer segmentation
- 🖥️ **Responsive Design**: Works on all device sizes
- ⚡ **Fast API**: Responses under 30 seconds guaranteed

## Technical Stack

```mermaid
graph TD
    A[Frontend: Next.js] -->|API Calls| B[Backend: Node.js/Express]
    B -->|Data Storage| C[MongoDB Atlas]
    A -->|Hosting| D[Vercel]
    B -->|Hosting| E[Render]
```

## Project Structure


```
HiGO-Analytics/                     # Root project folder
│
├── backend/                        # Backend server code
│   ├── config/                     # Configuration files (Mongo DB)
│   ├── controllers/                # Business logic handlers
│   ├── models/                     # Database models/schemas
│   ├── routes/                     # API endpoint definitions
│   ├── utils/                      # Helper functions/utilities
│   ├── app.js                      # Express application setup
│   ├── package-lock.json           
│   ├── package.json                
│   └── server.js                   # Server entry point
│
└── frontend/                       # Frontend application
    ├── public/                     # Static assets (fonts, images, etc.)
    ├── src/                        # Main application source code
    ├── .eslintrc.json              # ESLint configuration
    ├── jsconfig.json               # JavaScript path aliases
    ├── next.config.js              
    ├── package-lock.json           
    ├── package.json                
    ├── postcss.config.js           # PostCSS configuration
    ├── README.md                   # Frontend documentation
    └── tailwind.config.js          # Tailwind CSS configuration
```

## Development & Deployment

### MongoDB Atlas Setup

1. **Allow All IPs (Temporary)**
   - Go to MongoDB Atlas → Security → Network Access
   - Click "Add IP Address"
   - Enter `0.0.0.0/0` (allow all IPs)
   - Click "Confirm"

2. **Connection String**
   ```env
   MONGO=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/yourdb?retryWrites=true&w=majority
   ```

3. **After Deployment**
   - Restrict IPs to only Render's IP ranges
   - Enable "Database Access" with proper user privileges

#### Important Security Note
```diff
- Remember to remove 0.0.0.0/0 after testing and replace with Render's specific IP ranges
+ Make sure you've added the 0.0.0/0 IP address to allow Render to connect during initial deployment
```

### Frontend Setup (Next.js)

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Configure environment
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000" > .env.local

# 3. Run development server
npm run dev     # Port 3000 by default

# 4. Production build
npm run build   # Creates optimized production build
npm start       # Starts production server
```

### Deployment Guides

**Backend to Render:**
1. Create new `Web Service` on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGO`: Your MongoDB Atlas connection string
   - `PORT`: 10000 (Render's default)
4. Set build command: `npm install`
5. Set start command: `node server.js`

**Frontend to Vercel:**
1. Import project from GitHub
2. Automatic detection for Next.js
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com`)
4. Deploy (no build configuration needed)

### Important Notes:
#### For continuous deployment:
   - Enable GitHub webhooks in both Render and Vercel
   - Main branch pushes will trigger automatic redeploys