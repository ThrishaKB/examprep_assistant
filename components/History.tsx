import React, { useState, useEffect } from 'react';
import { getTestHistory, clearTestHistory } from '../services/storageService';
import { SavedTest } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import TestResultDetail from './TestResultDetail';

const TestSummaryCard: React.FC<{ test: SavedTest; onView: () => void }> = ({ test, onView }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <p className="font-bold text-slate-800">Test taken on {new Date(test.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-500 mt-1">Chapters: {test.options.chapters.join(', ')}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                 <p className="text-lg font-bold text-indigo-600 flex-shrink-0">
                    Score: {test.totalScore}/{test.maxScore}
                 </p>
                 <Button onClick={onView} className="w-full sm:w-auto !py-2 !px-4 !text-sm">View Details</Button>
            </div>
        </div>
    );
};


const History: React.FC = () => {
    const [history, setHistory] = useState<SavedTest[]>([]);
    const [selectedTest, setSelectedTest] = useState<SavedTest | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const tests = await getTestHistory();
            setHistory(tests);
        };
        fetchHistory();
    }, []);

    const handleClearHistory = async () => {
        if (window.confirm("Are you sure you want to delete all your test history? This action cannot be undone.")) {
            await clearTestHistory();
            setHistory([]);
        }
    };

    if (selectedTest) {
        return <TestResultDetail test={selectedTest} onBack={() => setSelectedTest(null)} />;
    }

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-700">Test History</h2>
                    <p className="text-slate-500 mt-1">Review your past mock tests and track your progress.</p>
                 </div>
                 {history.length > 0 && (
                     <Button onClick={handleClearHistory} className="!bg-red-600 hover:!bg-red-700 mt-4 sm:mt-0 !py-2 !px-4 !text-sm">
                        Clear History
                     </Button>
                 )}
            </div>

            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map(test => (
                        <TestSummaryCard key={test.id} test={test} onView={() => setSelectedTest(test)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-slate-600">You haven't completed any tests yet.</p>
                    <p className="text-slate-500 mt-1">Go to the "Mock Test" tab to generate and take a test.</p>
                </div>
            )}
        </Card>
    );
};

export default History;