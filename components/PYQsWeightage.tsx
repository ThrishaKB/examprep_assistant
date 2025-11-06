
import React, { useState, useCallback } from 'react';
import { analyzePYQs } from '../services/geminiService';
import { PYQAnalysis } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const PYQsWeightage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<PYQAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setAnalysis(null);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file) {
            setError('Please select a PDF file.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const base64String = await fileToBase64(file);
            const result = await analyzePYQs(base64String, file.type);
            setAnalysis(result);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-slate-700">PYQs & Weightage Analysis</h2>
            <p className="text-slate-500 mb-6">Upload a PDF of a past question paper, and our AI will break down the chapter-wise weightage and list the questions.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <label className="w-full sm:w-auto px-4 py-2 bg-white text-indigo-600 rounded-lg shadow border border-indigo-200 cursor-pointer hover:bg-indigo-50 transition-colors">
                    <span className="truncate max-w-xs">{file ? file.name : 'Choose PDF File'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isLoading} />
                </label>
                <Button onClick={handleAnalyze} disabled={isLoading || !file}>
                    {isLoading ? 'Analyzing...' : 'Analyze PDF'}
                </Button>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            <div className="mt-8">
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <Spinner />
                        <span className="ml-2 text-slate-600">AI is analyzing your document...</span>
                    </div>
                )}
                {analysis && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">Chapter Weightage</h3>
                            <div className="space-y-3">
                                {analysis.weightage.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-base font-medium text-slate-700">{item.chapter}</span>
                                            <span className="text-sm font-medium text-indigo-600">{item.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">Identified Questions</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {analysis.pyqs.map((q, index) => (
                                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <p className="font-medium text-slate-800">{q.question}</p>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{q.chapter}</span>
                                            <span className="font-semibold text-slate-600">{q.marks} Marks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PYQsWeightage;