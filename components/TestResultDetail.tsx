import React from 'react';
import { SavedTest } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const ReadOnlyQuestionCard: React.FC<{ question: SavedTest['questions'][0], questionNumber: number }> = ({ question, questionNumber }) => {
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            {/* Question */}
            <p className="font-semibold text-slate-800 mb-4">
                <span className="text-indigo-600 font-bold mr-2">{questionNumber}.</span> 
                {question.question}
                <span className="text-sm font-medium text-slate-500 ml-2">({question.marks} {question.marks === 1 ? 'Mark' : 'Marks'})</span>
            </p>

            {/* User's Answer */}
            <div className="mb-4">
                 <h4 className="font-bold text-slate-700 text-sm mb-1">Your Answer</h4>
                 <div className="bg-white p-3 rounded border border-slate-200 text-slate-600">
                     {question.userAnswer || <span className="italic text-slate-400">No answer provided.</span>}
                 </div>
            </div>

            {/* Evaluation */}
            {question.evaluation && (
                 <div className="space-y-4">
                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                        <h4 className="font-bold text-indigo-800">Result</h4>
                        <p className="text-lg font-bold text-indigo-900">Score: {question.evaluation.score} / {question.marks}</p>
                        <p className="mt-2 text-indigo-700">{question.evaluation.feedback}</p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <h4 className="font-bold text-green-800">Model Answer</h4>
                        <p className="mt-2 text-green-900">{question.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


const TestResultDetail: React.FC<{ test: SavedTest; onBack: () => void }> = ({ test, onBack }) => {
    return (
        <Card>
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to History
                </button>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Test Result</h2>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
                    <span><strong>Date:</strong> {new Date(test.date).toLocaleString()}</span>
                    <span><strong>Chapters:</strong> {test.options.chapters.join(', ')}</span>
                    <span><strong>Difficulty:</strong> {test.options.difficulty}</span>
                </div>
                <p className="text-3xl font-bold mt-4 text-indigo-600">
                    Final Score: {test.totalScore} / {test.maxScore}
                </p>
            </div>

            <div className="space-y-8">
                {test.questions.map((q, index) => (
                    <ReadOnlyQuestionCard 
                        key={index}
                        question={q}
                        questionNumber={index + 1}
                    />
                ))}
            </div>
        </Card>
    );
};

export default TestResultDetail;
