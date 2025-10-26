import React, { useState } from 'react';
import { runAiAnalysis } from '../../services/geminiService';

const AiAssistant: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt && !file) {
            setResponse("Please enter a query or upload a document.");
            return;
        }
        setIsLoading(true);
        setResponse('');
        const result = await runAiAnalysis(prompt, file || undefined);
        setResponse(result);
        setIsLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    
    const suggestedPrompts = [
        "Summarize this document for a patient.",
        "What are the key findings in this report?",
        "Explain what a high white blood cell count means.",
        "What is metformin used for?"
    ];

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#111827] mb-2">Ask Docu-Rex AI</h3>
                <p className="text-[#4B5563] mb-6">Get insights from your medical documents or ask general health questions. Powered by Gemini.</p>
                
                <div className="mb-4">
                    <p className="text-sm font-medium text-[#4B5563] mb-2">Suggested Prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map(p => (
                           <button key={p} onClick={() => setPrompt(p)} className="px-3 py-1 bg-gray-100 text-[#4B5563] rounded-full text-sm hover:bg-gray-200 transition-colors">{p}</button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your question here, or upload a document below and ask me to summarize it..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB]"
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E0F2FE] file:text-[#2563EB] hover:file:bg-[#BFDBFE]"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] transition-colors"
                        >
                            {isLoading ? 'Thinking...' : 'Ask AI'}
                        </button>
                    </div>
                    {file && <p className="mt-2 text-sm text-gray-500">File to analyze: {file.name}</p>}
                </form>
            </div>
            
            {(isLoading || response) && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-lg font-bold text-[#111827] mb-4">AI Response:</h4>
                    {isLoading ? <SkeletonLoader /> : (
                         <div className="prose prose-blue max-w-none text-[#4B5563] whitespace-pre-wrap">
                            {response}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiAssistant;
