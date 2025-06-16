import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Category } from '../types';
import { getDifficultyTagClasses } from '../utils/helpers';

interface CuratedHardListProps {
  category: Category;
}

export default function CuratedHardList({ category }: CuratedHardListProps) {
  if (!category.hardList || category.hardList.length === 0) {
    return null;
  }

  const curatedProblems = category.hardList
    .map(hardName => category.problems.find(p => p.name === hardName))
    .filter(Boolean) as Category['problems'];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Curated Hard Problems</h3>
      <p className="text-sm text-slate-500 mb-4">
        This is a curated list of problems that are considered particularly challenging for this topic, 
        which may include some Medium-difficulty questions.
      </p>
      <div className="space-y-3">
        {curatedProblems.map(problem => (
          <div 
            key={problem.name}
            className="flex justify-between items-center bg-slate-50/50 p-3 rounded-lg border border-slate-200/80"
          >
            <span className="text-slate-700 font-medium">{problem.name}</span>
            <div className="flex items-center space-x-2">
              <span className={getDifficultyTagClasses(problem.difficulty)}>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}