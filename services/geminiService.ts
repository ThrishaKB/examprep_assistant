
// Fix: Provide full content for services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, PYQAnalysis, Question, MockTestOptions, EvaluationResult } from "../types";

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates revision notes from a given text.
 */
export const generateRevisionNotes = async (chapterText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please generate concise revision notes in markdown format for the following chapter text. Focus on key definitions, concepts, and important points. Use headings and bullet points for clarity. \n\n---${chapterText}---`,
            config: {
                temperature: 0.2,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating revision notes:", error);
        throw new Error("Failed to generate revision notes. Please try again.");
    }
};

/**
 * Generates flashcards from a given text.
 */
export const generateFlashcards = async (chapterText: string): Promise<Flashcard[]> => {
    const flashcardSchema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 10-15 flashcards from the following text. Each flashcard should have a clear question and a concise answer. \n\n---${chapterText}---`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: flashcardSchema,
                },
            },
        });
        
        const jsonText = response.text.trim();
        const flashcards = JSON.parse(jsonText);
        return flashcards;
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards. The AI couldn't process the request.");
    }
};

/**
 * Analyzes a past question paper PDF to extract questions and chapter weightage.
 */
export const analyzePYQs = async (pdfBase64: string, mimeType: string): Promise<PYQAnalysis> => {
    const pyqSchema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            chapter: { type: Type.STRING },
            marks: { type: Type.NUMBER },
        },
        required: ["question", "chapter", "marks"],
    };
    
    const weightageSchema = {
        type: Type.OBJECT,
        properties: {
            chapter: { type: Type.STRING },
            percentage: { type: Type.NUMBER },
        },
        required: ["chapter", "percentage"],
    };

    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            weightage: {
                type: Type.ARRAY,
                items: weightageSchema,
            },
            pyqs: {
                type: Type.ARRAY,
                items: pyqSchema,
            },
        },
        required: ["weightage", "pyqs"],
    };

    try {
        const pdfPart = {
            inlineData: {
                data: pdfBase64,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: `Analyze this question paper. Identify each question, its chapter, and the marks allocated. Also, calculate the chapter-wise weightage as a percentage of total marks. The sum of all percentages in weightage should be 100.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using pro for better PDF understanding
            contents: { parts: [pdfPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const analysis = JSON.parse(jsonText);
        return analysis;
    } catch (error) {
        console.error("Error analyzing PYQs:", error);
        throw new Error("Failed to analyze the question paper. Please ensure it's a valid PDF.");
    }
};

/**
 * Generates a mock test with long and short answer questions.
 */
export const generateMockTest = async (options: MockTestOptions): Promise<Question[]> => {
    const questionSchema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING, description: "A detailed, correct answer for the question." },
            chapter: { type: Type.STRING },
            marks: { type: Type.NUMBER },
        },
        required: ["question", "answer", "chapter", "marks"],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a mock test with the following specifications:
            - Number of questions: ${options.numQuestions}
            - Chapters: ${options.chapters.join(', ')}
            - Difficulty: ${options.difficulty}
            
            Each question should require a typed answer, not multiple choice. Include a mix of one-mark short answer questions and longer descriptive answer questions (3-5 marks). For each question, provide the question text, a detailed correct answer, the chapter it belongs to, and the marks.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema,
                },
            },
        });
        
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText);
        return questions;

    } catch (error) {
        console.error("Error generating mock test:", error);
        throw new Error("Failed to generate the mock test. Please try adjusting your options.");
    }
};

/**
 * Evaluates a user's typed answer against the model answer.
 */
export const evaluateAnswer = async (question: string, userAnswer: string, modelAnswer: string, marks: number): Promise<EvaluationResult> => {
    const evaluationSchema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: `The score awarded to the user, from 0 to ${marks}.` },
            feedback: { type: Type.STRING, description: "Constructive feedback for the user on their answer." },
        },
        required: ["score", "feedback"],
    };
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert teacher evaluating a student's answer.
            The question is: "${question}" (Worth ${marks} marks).
            The student's answer is: "${userAnswer}".
            The ideal correct answer is: "${modelAnswer}".
            
            Please evaluate the student's answer. Provide a score (out of ${marks}) and concise, constructive feedback. Be fair and encouraging. If the user answer is completely wrong, give a score of 0. If it is partially correct, give partial marks.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error evaluating answer:", error);
        throw new Error("The AI could not evaluate your answer at this time. Please try again.");
    }
};
