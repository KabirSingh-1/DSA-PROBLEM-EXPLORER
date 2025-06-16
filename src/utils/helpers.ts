export function generateLeetCodeUrl(problemName: string): string {
  const slug = problemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  return `https://leetcode.com/problems/${slug}/`;
}

export function getDifficultyTagClasses(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
  const colors = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-amber-100 text-amber-800',
    'Hard': 'bg-red-100 text-red-800',
  };
  return `text-xs font-semibold px-2 py-1 rounded-full ${colors[difficulty]}`;
}

export const difficultyColors = {
  'Easy': 'rgb(74, 222, 128)', // green-400
  'Medium': 'rgb(251, 191, 36)', // amber-400
  'Hard': 'rgb(239, 68, 68)', // red-500
};

export const difficultyBorderColors = {
  'Easy': 'rgb(34, 197, 94)', // green-500
  'Medium': 'rgb(245, 158, 11)', // amber-500
  'Hard': 'rgb(220, 38, 38)', // red-600
};