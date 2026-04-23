import { GoogleGenerativeAI } from "@google/generative-ai";
import { MedicineAnalysis, InteractionResult } from "../types";

// Get API key from environment (handled by vite.config.ts)
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

console.log('🔑 Gemini API Key status:', apiKey ? '✅ Configured' : '❌ Not configured');

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === 'undefined') {
  console.warn('⚠️ Gemini API key not configured. AI features will return mock data.');
  console.log('💡 Add VITE_GEMINI_API_KEY to .env.local and restart the dev server');
}

const genAI = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' && apiKey !== 'undefined' ? new GoogleGenerativeAI(apiKey) : null;

export const analyzeMedicine = async (
  imageData?: string,
  symptoms?: string
): Promise<MedicineAnalysis> => {
  console.log('🔬 analyzeMedicine called');
  console.log('📸 Has image:', !!imageData);
  console.log('💬 Has symptoms:', !!symptoms);
  console.log('🤖 AI instance:', genAI ? 'Available' : 'Not available');
  
  if (!genAI) {
    console.error('❌ AI not initialized - returning mock data');
    return {
      name: "Sample Medicine",
      purpose: "This is a demo response. Please configure your Gemini API key in .env.local to get real AI analysis.",
      dosage: "Configure API key for real dosage information",
      safetyNotes: "API key required for safety analysis",
      warning: "⚠️ Gemini API key not configured"
    };
  }

  try {
    // Use gemini-pro for text-only (doesn't support images)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const parts: any[] = [];
    
    const prompt = symptoms 
      ? `Analyze this medicine and consider these symptoms: "${symptoms}". ${imageData ? 'An image was provided but cannot be processed with this model. ' : ''}Provide a concise summary in JSON format with these exact fields: name (medicine name), purpose (what it's for), dosage (when and how to take), safetyNotes (important safety information), and optionally warning (any critical warnings).`
      : `Analyze this medicine. ${imageData ? 'An image was provided but cannot be processed with this model. Please describe the medicine name. ' : ''}Provide a concise summary in JSON format with these exact fields: name (medicine name), purpose (what it's for), dosage (when and how to take), safetyNotes (important safety information), and optionally warning (any critical warnings).`;

    parts.push(prompt);
    
    // Note: gemini-pro doesn't support images, so we skip the image data

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Received response from Gemini API');
    console.log('Raw response:', text);
    
    let parsedResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = {
          name: "Medicine Analysis",
          purpose: text,
          dosage: "Please consult the package insert or your doctor",
          safetyNotes: "Consult your healthcare provider before use"
        };
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      parsedResult = {
        name: "Analysis Complete",
        purpose: text || 'Unable to parse response',
        dosage: "Please consult the package insert or your doctor",
        safetyNotes: "Consult your healthcare provider before use"
      };
    }
    
    console.log('📊 Parsed result:', parsedResult);
    return parsedResult;
  } catch (error) {
    console.error('❌ Error in analyzeMedicine:', error);
    throw error;
  }
};

export const checkInteractions = async (medicines: string[]): Promise<InteractionResult> => {
  console.log('🔬 checkInteractions called with:', medicines);
  console.log('🤖 AI instance:', genAI ? 'Available' : 'Not available');
  
  if (!genAI) {
    console.error('❌ AI not initialized - returning mock data');
    return {
      isSafe: true,
      severity: 'none',
      interactionDescription: 'API key not configured. Please add your Gemini API key to .env.local for real interaction checking.',
      suggestedTiming: 'Configure API key for timing suggestions'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Check for drug-drug interactions between the following medicines: ${medicines.join(', ')}. Provide a safety assessment in JSON format with these exact fields: isSafe (boolean - true if safe to take together), severity (string - one of: none, low, moderate, high), interactionDescription (string - description of any interactions), suggestedTiming (string - timing recommendations).`;

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Received response from Gemini API');
    console.log('Raw response:', text);
    
    let parsedResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = {
          isSafe: true,
          severity: 'none',
          interactionDescription: text,
          suggestedTiming: 'Follow prescription instructions'
        };
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      parsedResult = {
        isSafe: true,
        severity: 'none',
        interactionDescription: text || 'Unable to parse response',
        suggestedTiming: 'Follow prescription instructions'
      };
    }
    
    console.log('📊 Parsed result:', parsedResult);
    return parsedResult;
  } catch (error) {
    console.error('❌ Error in checkInteractions:', error);
    throw error;
  }
};

export const findNearbyDoctors = async (lat: number, lng: number): Promise<any[]> => {
  return [];
};
