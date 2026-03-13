# Gemini API Setup Guide

## Getting Your Gemini API Key

To enable the Medicine Analyzer and Safety Checker features, you need a Gemini API key:

1. **Visit Google AI Studio:**
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select a Google Cloud project (or create a new one)
   - Copy the generated API key

3. **Add to Your Project:**
   - Open `.env.local` file in your project root
   - Replace the placeholder with your actual key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Restart the Servers:**
   - Stop both backend and frontend servers
   - Start them again to load the new API key

## Current Status

Without a valid API key, the Medicine Analyzer and Safety Checker will show demo/mock responses with a warning message.

Once you add a valid API key, these features will provide real AI-powered analysis.

## Note

The API key in `.env.local` is currently a placeholder. Replace it with your actual Gemini API key to enable AI features.
