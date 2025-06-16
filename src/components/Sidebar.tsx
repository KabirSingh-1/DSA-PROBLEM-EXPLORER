import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Sidebar({ categories, activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <nav className="sidebar md:w-64 bg-white border-r border-slate-200 p-4 md:p-6 flex-shrink-0 flex md:flex-col overflow-x-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-0 md:mb-6 mr-4 md:mr-0 shrink-0">
        DSA Explorer
      </h1>
      <ul className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
        {categories.map((category) => {
          const totalProblems = category.problems.length;
          const completedProblems = category.problems.filter(p => p.completed).length;
          const progressText = totalProblems > 0 ? `(${completedProblems}/${totalProblems})` : '';
          const isActive = category.category === activeCategory;

          return (
            <li key={category.category}>
              <button
                onClick={() => onCategoryChange(category.category)}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="hidden md:inline">{category.category}</span>
                <span className="text-xs font-normal text-slate-400 ml-auto hidden md:inline">
                  {progressText}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}