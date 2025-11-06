import React, { useState, useCallback } from 'react';
import { generateMockTest, evaluateAnswer } from '../services/geminiService';
import { saveTest } from '../services/storageService';
import { Question, MockTestOptions, EvaluationResult, SavedTest, SavedQuestion } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Input from './common/Input';
import QuestionCard from './QuestionCard';

const availableChapters = [
    'Microorganisms', 'Combustion and Flame', 'Cell Structure', 'Reproduction in Animals', 'Force and Pressure', 'Sound'
];

const MockTest: React.FC = () => {
    const [options, setOptions] = useState<MockTestOptions>({
        numQuestions: 5,
        chapters: ['Microorganisms'],
        difficulty: 'Medium',
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [evaluations, setEvaluations] = useState<(EvaluationResult | null)[]>([]);
    const [evaluationStates, setEvaluationStates] = useState<('idle' | 'evaluating')[]>([]);
    const [evaluationErrors, setEvaluationErrors] = useState<(string | null)[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [testStarted, setTestStarted] = useState(false);
    const [testFinished, setTestFinished] = useState(false);

    const handleGenerateTest = useCallback(async () => {
        if (options.chapters.length === 0) {
            setError('Please select at least one chapter.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        setTestStarted(false);
        setTestFinished(false);

        try {
            const result = await generateMockTest(options);
            setQuestions(result);
            setUserAnswers(Array(result.length).fill(''));
            setEvaluations(Array(result.length).fill(null));
            setEvaluationStates(Array(result.length).fill('idle'));
            setEvaluationErrors(Array(result.length).fill(null));
            setTestStarted(true);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [options]);
    
    const handleChapterChange = (chapter: string) => {
        setOptions(prev => {
            const newChapters = prev.chapters.includes(chapter)
                ? prev.chapters.filter(t => t !== chapter)
                : [...prev.chapters, chapter];
            return { ...prev, chapters: newChapters };
        });
    };

    const handleAnswerChange = (index: number, answer: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = answer;
        setUserAnswers(newAnswers);
    };

    const handleEvaluate = async (index: number) => {
        const newErrors = [...evaluationErrors];
        if (!userAnswers[index].trim()) {
            newErrors[index] = "Please enter an answer before checking.";
            setEvaluationErrors(newErrors);
            return;
        }

        const newStates = [...evaluationStates];
        newStates[index] = 'evaluating';
        setEvaluationStates(newStates);

        newErrors[index] = null;
        setEvaluationErrors(newErrors);

        try {
            const question = questions[index];
            const result = await evaluateAnswer(question.question, userAnswers[index], question.answer, question.marks);
            const newEvals = [...evaluations];
            newEvals[index] = result;
            setEvaluations(newEvals);
        } catch (e: any) {
            newErrors[index] = e.message || "An unknown error occurred during evaluation.";
            setEvaluationErrors(newErrors);
        } finally {
            const newStates = [...evaluationStates];
            newStates[index] = 'idle';
            setEvaluationStates(newStates);
        }
    };
    
    const handleFinishAndSave = async () => {
        const maxScore = questions.reduce((sum, q) => sum + q.marks, 0);
        const totalScore = evaluations.reduce((sum, e) => sum + (e?.score || 0), 0);

        const savedQuestions: SavedQuestion[] = questions.map((q, i) => ({
            ...q,
            userAnswer: userAnswers[i],
            evaluation: evaluations[i],
        }));

        const savedTest: SavedTest = {
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
            options,
            questions: savedQuestions,
            totalScore,
            maxScore,
        };

        try {
            await saveTest(savedTest);
            setTestFinished(true);
        } catch (e: any) {
            setError("Failed to save test results. Please try again.");
        }
    };

    const handleNewTest = () => {
        setTestStarted(false);
        setTestFinished(false);
        setQuestions([]);
    };

    if (testFinished) {
        return (
            <Card>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Test Saved!</h2>
                    <p className="text-slate-600 mb-6">Your test results have been saved to your history. You can review them anytime from the "Test History" tab.</p>
                    <Button onClick={handleNewTest}>Start a New Test</Button>
                </div>
            </Card>
        );
    }
    
    if (testStarted) {
        const allEvaluated = evaluations.every(e => e !== null);
        return (
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-700">Mock Test</h2>
                    <Button onClick={handleNewTest}>Start New Test</Button>
                </div>
                
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <QuestionCard 
                            key={index}
                            question={q}
                            questionNumber={index + 1}
                            userAnswer={userAnswers[index]}
                            evaluation={evaluations[index]}
                            isEvaluating={evaluationStates[index] === 'evaluating'}
                            error={evaluationErrors[index]}
                            onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                            onEvaluate={() => handleEvaluate(index)}
                        />
                    ))}
                </div>
                <div className="mt-8 border-t pt-6 text-center">
                    {allEvaluated ? (
                        <div>
                             <h3 className="text-xl font-semibold text-slate-800">Test Complete!</h3>
                             <p className="text-3xl font-bold my-2 text-indigo-600">
                                Total Score: {evaluations.reduce((sum, e) => sum + (e?.score || 0), 0)} / {questions.reduce((sum, q) => sum + q.marks, 0)}
                             </p>
                             <Button onClick={handleFinishAndSave} className="mt-4">
                                Finish & Save Results
                             </Button>
                        </div>
                    ) : (
                        <p className="text-slate-500">Please complete and evaluate all questions to see your final score and save the test.</p>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-slate-700">Generate a Mock Test</h2>
            <p className="text-slate-500 mb-6">Customize your test by selecting chapters, number of questions, and difficulty level.</p>
            
            <div className="space-y-6">
                {/* Chapters selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Chapters (select at least one)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableChapters.map(chapter => (
                            <button
                                key={chapter}
                                onClick={() => handleChapterChange(chapter)}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                    options.chapters.includes(chapter)
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {chapter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div>
                    <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-2">Number of Questions</label>
                    <Input 
                        type="number"
                        id="numQuestions"
                        value={options.numQuestions}
                        onChange={e => setOptions({...options, numQuestions: parseInt(e.target.value, 10)})}
                        min="1"
                        max="20"
                    />
                </div>

                {/* Difficulty */}
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                     <div className="flex space-x-2">
                        {(['Easy', 'Medium', 'Hard'] as const).map(level => (
                             <button
                                key={level}
                                onClick={() => setOptions({...options, difficulty: level})}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                                    options.difficulty === level
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            <div className="mt-8">
                <Button onClick={handleGenerateTest} disabled={isLoading || options.chapters.length === 0}>
                    {isLoading ? <Spinner /> : 'Generate Test'}
                </Button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </Card>
    );
};

export default MockTest;