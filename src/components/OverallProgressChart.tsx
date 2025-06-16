import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Category } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OverallProgressChartProps {
  categories: Category[];
}

export default function OverallProgressChart({ categories }: OverallProgressChartProps) {
  let totalProblems = 0;
  let totalCompleted = 0;
  
  categories.forEach(category => {
    totalProblems += category.problems.length;
    totalCompleted += category.problems.filter(p => p.completed).length;
  });

  const progressPercentage = totalProblems > 0 ? ((totalCompleted / totalProblems) * 100).toFixed(1) : 0;

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      label: 'Overall Progress',
      data: [totalCompleted, totalProblems - totalCompleted],
      backgroundColor: ['rgb(74, 222, 128)', 'rgb(203, 213, 225)'], // green-400, slate-300
      borderColor: ['rgb(34, 197, 94)', 'rgb(148, 163, 184)'], // green-500, slate-400
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
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' problems';
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: `Overall Completion: ${progressPercentage}%`,
        font: {
          size: 20,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 10
        },
        color: '#1e293b' // slate-800
      }
    },
    cutout: '65%'
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Your Overall Progress</h3>
      <p className="text-sm text-slate-500 mb-4">
        Track your progress across all DSA categories. This overview visualizes how many problems you've completed out of the total.
      </p>
      <div className="relative w-full max-w-[400px] mx-auto h-[300px] md:h-[350px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </section>
  );
}