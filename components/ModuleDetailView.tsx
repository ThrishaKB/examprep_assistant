import React from 'react';
import { Flashcard } from '../types';
import Spinner from './common/Spinner';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import FlashcardViewer from './FlashcardViewer';

interface ModuleDetailViewProps {
    subjectName: string;
    moduleName: string;
    notes: string;
    flashcards: Flashcard[];
    isLoading: boolean;
    error: string | null;
    onBack: () => void;
}

const NotesRenderer: React.FC<{ content: string }> = ({ content }) => {
    // A simple function to parse markdown-like text and apply Tailwind classes
    const renderLine = (line: string, index: number) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-slate-700">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-800 border-b pb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-slate-900">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-5 list-disc text-slate-600">{line.substring(2)}</li>;
        }
        
        // Handle bold text with **text**
        const parts = line.split('**');
        return (
            <p key={index} className="my-2 text-slate-600 leading-relaxed">
                {parts.map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-700">{part}</strong> : part
                )}
            </p>
        );
    };

    return (
         <div className="prose prose-slate max-w-none">
            {content.split('\n').filter(line => line.trim() !== '').map(renderLine)}
        </div>
    );
};


const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({ subjectName, moduleName, notes, flashcards, isLoading, error, onBack }) => {

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Modules
                </button>
                 <h2 className="text-xl md:text-2xl font-bold text-slate-800">{subjectName}</h2>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Spinner />
                    <p className="mt-4 text-slate-600">Generating revision materials...</p>
                </div>
            )}
            
            {error && !isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <p className="text-red-500 font-semibold">Error!</p>
                    <p className="text-slate-600 mt-2">{error}</p>
                    <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Try Again</button>
                </div>
            )}

            {!isLoading && !error && (
                <div>
                    {/* Revision Notes Section */}
                    <div className="mb-12">
                         <h3 className="text-2xl font-bold text-slate-800 mb-4">{moduleName} - Revision Notes</h3>
                         <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                             <NotesRenderer content={notes} />
                         </div>
                    </div>
                    
                    {/* Flashcards Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Flashcards</h3>
                         <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                             <FlashcardViewer flashcards={flashcards} />
                         </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ModuleDetailView;