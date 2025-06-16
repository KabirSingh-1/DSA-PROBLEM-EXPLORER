import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Category, DifficultyCount } from '../types';
import { difficultyColors, difficultyBorderColors } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DifficultyChartProps {
  category: Category;
}

export default function DifficultyChart({ category }: DifficultyChartProps) {
  const counts: DifficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
  
  category.problems.forEach(problem => {
    if (counts[problem.difficulty] !== undefined) {
      counts[problem.difficulty]++;
    }
  });

  const chartData = {
    labels: Object.keys(counts),
    datasets: [{
      label: 'Problem Count',
      data: Object.values(counts),
      backgroundColor: Object.keys(counts).map(d => difficultyColors[d as keyof typeof difficultyColors]),
      borderColor: Object.keys(counts).map(d => difficultyBorderColors[d as keyof typeof difficultyBorderColors]),
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 16, weight: 'bold' as const },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    cutout: '65%'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Difficulty Overview</h3>
      <p className="text-sm text-slate-500 mb-4">
        This chart shows the distribution of problems by difficulty for the selected category.
      </p>
      <div className="relative w-full max-w-[400px] mx-auto h-[300px] md:h-[350px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}