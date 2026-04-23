# MediFusion Deployment Guide

## Deploy to Vercel

### Prerequisites
1. GitHub account with your code pushed
2. Vercel account (free tier available)

### Steps to Deploy

1. **Push to GitHub** (if not done already):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository: `https://github.com/Sravanyadala421/medifusion.git`
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `GEMINI_API_KEY`: Your Google AI API key

3. **Environment Variables to Add**:
   ```
   MONGODB_URI=mongodb+srv://sravanyadala421:Sravan%40123@cluster0.mongodb.net/medifusion?retryWrites=true&w=majority&appName=Cluster0
   GEMINI_API_KEY=AIzaSyC-XPPiAjbQJDJHj0HS1TM9NQa2Txec1NU
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Alternative: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - For backend, use Netlify Functions or deploy separately

### Alternative: Deploy to Railway

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

### Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test admin login (sravanyadala7@gmail.com)
- [ ] Test doctor management
- [ ] Test appointment booking
- [ ] Test payment system
- [ ] Test AI features (Medicine Analyzer & Safety Checker)

### Troubleshooting

- **Build fails**: Check package.json scripts
- **API not working**: Verify environment variables
- **Database connection**: Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
- **AI features not working**: Verify Gemini API key

### Live URLs
- Frontend: Will be provided after deployment
- API: Same domain + /api endpoints