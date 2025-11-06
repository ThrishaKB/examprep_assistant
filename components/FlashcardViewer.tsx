import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import RotateCwIcon from './icons/RotateCwIcon';

interface FlashcardViewerProps {
    flashcards: Flashcard[];
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Reset flip state when card changes
        setIsFlipped(false);
    }, [currentIndex]);
    
    // Reset index if flashcards array changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [flashcards]);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (!flashcards || flashcards.length === 0) {
        return <p className="text-slate-600 text-center py-10">No flashcards available for this module.</p>;
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div>
            <div className="w-full h-80 perspective-1000">
                <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front of Card */}
                    <div className="absolute w-full h-full backface-hidden bg-slate-100 border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center text-center cursor-pointer">
                        <span className="text-sm font-semibold text-slate-500 mb-2">Question</span>
                        <p className="text-lg md:text-xl font-semibold text-slate-800">{currentCard.question}</p>
                    </div>
                    {/* Back of Card */}
                    <div className="absolute w-full h-full backface-hidden bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col justify-center items-center text-center rotate-y-180 cursor-pointer overflow-y-auto">
                        <span className="text-sm font-semibold text-green-700 mb-2">Answer</span>
                        <p className="text-md md:text-lg text-green-900">{currentCard.answer}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0} 
                    className="p-3 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous card"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-4">
                        <p className="text-slate-600 font-semibold">
                        {currentIndex + 1} / {flashcards.length}
                    </p>
                    <button 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                        aria-label="Flip card"
                    >
                        <RotateCwIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <button 
                    onClick={handleNext} 
                    disabled={currentIndex === flashcards.length - 1} 
                    className="p-3 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next card"
                >
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FlashcardViewer;
