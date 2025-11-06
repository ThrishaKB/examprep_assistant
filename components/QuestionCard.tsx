
import React from 'react';
import { Question, EvaluationResult } from '../types';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    userAnswer: string;
    evaluation: EvaluationResult | null;
    isEvaluating: boolean;
    error: string | null;
    onAnswerChange: (answer: string) => void;
    onEvaluate: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
    question, 
    questionNumber, 
    userAnswer,
    evaluation,
    isEvaluating,
    error,
    onAnswerChange,
    onEvaluate,
}) => {
    
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 transition-shadow hover:shadow-md">
            <p className="font-semibold text-slate-800 mb-4">
                <span className="text-indigo-600 font-bold mr-2">{questionNumber}.</span> 
                {question.question}
                <span className="text-sm font-medium text-slate-500 ml-2">({question.marks} {question.marks === 1 ? 'Mark' : 'Marks'})</span>
            </p>
            
            <textarea
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100"
                rows={4}
                disabled={isEvaluating || !!evaluation}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            {!evaluation && (
                 <div className="mt-4">
                    <Button onClick={onEvaluate} disabled={isEvaluating}>
                        {isEvaluating ? 'Evaluating...' : 'Check Answer'}
                    </Button>
                </div>
            )}

            {isEvaluating && <div className="mt-4 flex justify-center"><Spinner /></div>}

            {evaluation && (
                <div className="mt-6 space-y-4">
                    {/* Evaluation Result */}
                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                        <h4 className="font-bold text-indigo-800">Result</h4>
                        <p className="text-lg font-bold text-indigo-900">Score: {evaluation.score} / {question.marks}</p>
                        <p className="mt-2 text-indigo-700">{evaluation.feedback}</p>
                    </div>

                    {/* Model Answer */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <h4 className="font-bold text-green-800">Model Answer</h4>
                        <p className="mt-2 text-green-900">{question.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;