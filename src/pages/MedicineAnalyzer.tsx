
import React, { useState, useRef } from 'react';
import { Camera, Upload, Send, Pill, FileText, AlertCircle, RefreshCw, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeMedicine } from '../services/geminiService';
import { MedicineAnalysis } from '../types';

const MedicineAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicineAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !symptoms) return;
    
    setIsAnalyzing(true);
    try {
      const data = await analyzeMedicine(image || undefined, symptoms || undefined);
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSymptoms('');
    setResult(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Medicine Analyzer</h1>
        <p className="text-slate-500">Upload a medicine photo or describe symptoms for AI-powered guidance.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Medication Photo / Prescription</label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all ${image ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain rounded-2xl p-2" />
              ) : (
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full inline-block mb-3">
                    <Camera className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click to upload or take a photo</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </div>
            {image && (
              <button 
                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                className="mt-2 text-xs text-red-500 font-semibold hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Symptoms or Condition (Optional)</label>
            <textarea 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900"
              placeholder="e.g. I have a headache and these pills were given to me last week..."
            ></textarea>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!image && !symptoms)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Medication...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Start Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Pill className="w-6 h-6" />
                  <span className="font-bold text-xl">{result.name}</span>
                </div>
                <p className="text-blue-100 text-sm">AI Analysis Result</p>
              </div>
              
              <div className="p-6 space-y-6">
                <ResultItem icon={<FileText className="w-5 h-5 text-blue-500" />} label="What it's for" content={result.purpose} />
                <ResultItem icon={<Clock className="w-5 h-5 text-emerald-500" />} label="When to take" content={result.dosage} />
                <ResultItem icon={<ShieldCheck className="w-5 h-5 text-indigo-500" />} label="Safety Notes" content={result.safetyNotes} />
                
                {result.warning && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{result.warning}</p>
                  </div>
                )}

                <button 
                  onClick={reset}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-3xl">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Activity className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Awaiting Input</h3>
              <p className="text-sm text-slate-400 max-w-xs">Upload a medicine or type symptoms to receive a professional AI summary.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full tracking-wider">Dosage Help</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full tracking-wider">Safety First</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded-full tracking-wider">AI Guidance</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ icon, label, content }: { icon: React.ReactNode, label: string, content: string }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-700 text-sm leading-relaxed">{content}</p>
    </div>
  </div>
);

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default MedicineAnalyzer;
