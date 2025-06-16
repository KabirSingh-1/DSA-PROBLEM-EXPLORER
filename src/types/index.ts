export interface Problem {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  leetCodeUrl: string;
  explanation?: string;
}

export interface Category {
  category: string;
  icon: string;
  problems: Problem[];
  hardList: string[];
}

export interface DifficultyCount {
  Easy: number;
  Medium: number;
  Hard: number;
}

export type FilterType = 'All' | 'Easy' | 'Medium' | 'Hard';