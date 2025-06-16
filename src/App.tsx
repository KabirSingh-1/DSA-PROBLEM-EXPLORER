import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverallProgressChart from './components/OverallProgressChart';
import DifficultyChart from './components/DifficultyChart';
import ProblemList from './components/ProblemList';
import CuratedHardList from './components/CuratedHardList';
import LeetCodeProfile from './components/LeetCodeProfile';
import { Category, FilterType } from './types';
import { initialDsaData } from './data/dsaData';
import { generateLeetCodeUrl } from './utils/helpers';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [progress, setProgress] = useLocalStorage<Category[]>('dsaProgress', []);

  // Initialize categories with progress data
  useEffect(() => {
    const initializedCategories: Category[] = initialDsaData.map(category => ({
      ...category,
      problems: category.problems.map(problem => {
        const savedCategory = progress.find(cat => cat.category === category.category);
        const savedProblem = savedCategory?.problems.find(p => p.name === problem.name);
        
        return {
          ...problem,
          completed: savedProblem?.completed || false,
          leetCodeUrl: generateLeetCodeUrl(problem.name),
          explanation: savedProblem?.explanation
        };
      })
    }));

    setCategories(initializedCategories);
    if (!activeCategory && initializedCategories.length > 0) {
      setActiveCategory(initializedCategories[0].category);
    }
  }, [progress, activeCategory]);

  // Save progress whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      setProgress(categories);
    }
  }, [categories, setProgress]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveFilter('All');
  };

  const handleProblemToggle = (problemName: string, completed: boolean) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.category === activeCategory
          ? {
              ...category,
              problems: category.problems.map(problem =>
                problem.name === problemName
                  ? { ...problem, completed }
                  : problem
              )
            }
          : category
      )
    );
  };

  const currentCategory = categories.find(cat => cat.category === activeCategory);
  const filters: FilterType[] = ['All', 'Easy', 'Medium', 'Hard'];

  if (!currentCategory) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{currentCategory.category}</h2>
              <p className="text-slate-500">An interactive guide to the DSA problem list.</p>
            </header>

            <OverallProgressChart categories={categories} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <DifficultyChart category={currentCategory} />
              </div>
              
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Problem List</h3>
                    <p className="text-sm text-slate-500">Filter the problems by difficulty.</p>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    {filters.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                          filter === activeFilter
                            ? 'bg-slate-800 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <ProblemList
                  category={currentCategory}
                  activeFilter={activeFilter}
                  onProblemToggle={handleProblemToggle}
                />
              </div>
            </div>

            <CuratedHardList category={currentCategory} />
            <LeetCodeProfile />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;