
import React, { useState } from 'react';
import { ShieldCheck, Plus, X, AlertTriangle, CheckCircle, Clock, ChevronLeft, RefreshCw, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkInteractions } from '../services/geminiService';
import { InteractionResult } from '../types';

const CombinationChecker: React.FC = () => {
  const [medicines, setMedicines] = useState<string[]>(['']);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);

  const addField = () => setMedicines([...medicines, '']);
  const removeField = (index: number) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };
  const updateField = (index: number, val: string) => {
    const newMeds = [...medicines];
    newMeds[index] = val;
    setMedicines(newMeds);
  };

  const handleCheck = async () => {
    const filteredMeds = medicines.filter(m => m.trim() !== '');
    if (filteredMeds.length < 2) return;

    setIsChecking(true);
    try {
      const data = await checkInteractions(filteredMeds);
      setResult(data);
    } catch (err) {
      console.error("Check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Safety Combination Checker</h1>
        <p className="text-slate-500">Lost your prescription? Check if your current medications can be safely taken together.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">Enter Medicines</h2>
            <div className="space-y-4">
              {medicines.map((med, idx) => (
                <div key={idx} className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-3.5">
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <input 
                      type="text" 
                      value={med}
                      onChange={(e) => updateField(idx, e.target.value)}
                      placeholder="e.g. Paracetamol, Ibuprofen..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900"
                    />
                  </div>
                  {medicines.length > 1 && (
                    <button 
                      onClick={() => removeField(idx)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              onClick={addField}
              className="mt-6 flex items-center text-blue-600 font-semibold text-sm hover:underline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add another medicine
            </button>
          </div>

          <button 
            onClick={handleCheck}
            disabled={isChecking || medicines.filter(m => m.trim()).length < 2}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Checking Safety Profile...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Check Interaction</span>
              </>
            )}
          </button>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Disclaimer: This AI tool is for informational purposes only. Always consult a real doctor before changing your medication routine.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95">
              <div className={`p-6 text-white flex items-center justify-between ${result.isSafe ? 'bg-emerald-600' : 'bg-red-600'}`}>
                <div className="flex items-center space-x-3">
                  {result.isSafe ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  <div>
                    <h3 className="font-bold text-xl">{result.isSafe ? 'Safe to Take' : 'Caution Required'}</h3>
                    <p className="text-xs opacity-90 capitalize">Severity: {result.severity}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interaction Analysis</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{result.interactionDescription}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Suggested Timing</p>
                  </div>
                  <p className="text-slate-600 text-sm">{result.suggestedTiming}</p>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Start New Check
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-3xl">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <ShieldCheck className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Safety Report</h3>
              <p className="text-sm text-slate-400 max-w-xs">Add at least two medications to generate an interaction safety report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinationChecker;
