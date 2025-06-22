import React, { useState } from 'react';
import { ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { Category, FilterType, Problem } from '../types';
import { getDifficultyTagClasses } from '../utils/helpers';

interface ProblemListProps {
  category: Category;
  activeFilter: FilterType;
  onProblemToggle: (problemName: string, completed: boolean) => void;
}

export default function ProblemList({ category, activeFilter, onProblemToggle }: ProblemListProps) {
  const [explanations, setExplanations] = useState<{ [key: string]: string }>({});
  const [loadingExplanations, setLoadingExplanations] = useState<{ [key: string]: boolean }>({});
  const [visibleExplanations, setVisibleExplanations] = useState<{ [key: string]: boolean }>({});

  const filteredProblems = category.problems.filter(p => 
    activeFilter === 'All' || p.difficulty === activeFilter
  );

  const getProblemExplanation = async (problem: Problem, problemIndex: number) => {
    const key = `${category.category}-${problem.name}`;
    
    if (explanations[key]) {
      setVisibleExplanations(prev => ({ ...prev, [key]: !prev[key] }));
      return;
    }

    setLoadingExplanations(prev => ({ ...prev, [key]: true }));
    setVisibleExplanations(prev => ({ ...prev, [key]: true }));

    const prompt = `Provide a concise, high-level explanation (around 2-3 sentences) of the core concept or approach for the Data Structures and Algorithms problem named "${problem.name}". Its difficulty is "${problem.difficulty}". Focus on explaining *what* the problem is about and the general *idea* behind solving it, without giving away the direct solution.`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };
    
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setExplanations(prev => ({ ...prev, [key]: text }));
      } else {
        setExplanations(prev => ({ ...prev, [key]: 'Error: Could not retrieve explanation.' }));
      }
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanations(prev => ({ ...prev, [key]: 'Error: Failed to fetch explanation. Please try again.' }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [key]: false }));
    }
  };

  if (filteredProblems.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No problems found for this filter.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {filteredProblems.map((problem, index) => {
        const key = `${category.category}-${problem.name}`;
        return (
          <div key={problem.name} className="problem-item bg-slate-50/50 p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/50 transition-all">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={problem.completed}
                onChange={(e) => onProblemToggle(problem.name, e.target.checked)}
                className="mr-3 h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
              />
              <div className="flex-1 flex justify-between items-center">
                <span className={`font-medium ${problem.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                  {problem.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`${getDifficultyTagClasses(problem.difficulty)} ${problem.completed ? 'opacity-70' : ''}`}>
                    {problem.difficulty}
                  </span>
                  <a
                    href={problem.leetCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                    title="View on LeetCode"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => getProblemExplanation(problem, index)}
                    disabled={loadingExplanations[key]}
                    className="px-2 py-1 text-xs font-medium bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {loadingExplanations[key] ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    <span>Explain Problem</span>
                  </button>
                </div>
              </div>
            </div>
            {visibleExplanations[key] && (
              <div className="mt-2 p-2 bg-slate-50 rounded-md">
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {loadingExplanations[key] 
                    ? 'Loading explanation...' 
                    : explanations[key]
                  }
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
