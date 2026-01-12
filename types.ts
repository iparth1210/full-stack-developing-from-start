
export enum ModuleStatus {
  LOCKED = 'LOCKED',
  CURRENT = 'CURRENT',
  COMPLETED = 'COMPLETED'
}

export type ResourceType = 'video' | 'article' | 'course' | 'interactive' | 'book' | 'documentation';

export interface Resource {
  type: ResourceType;
  label: string;
  url: string;
  duration?: string;
  provider?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  thumbnail?: string;
  embedId?: string;
}

export interface TheoryPoint {
  title: string;
  description: string;
  imageUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyTask {
  day: number;
  title: string;
  objective: string;
  conceptualWhy: string;
  funnyStory: string;
  storyImageUrl: string;
  practicalUsage: string;
  detailedTheory: TheoryPoint[];
  resources: Resource[];
  quiz?: QuizQuestion; // Optional quiz for the day
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  conceptualWhy: string;
  funnyStory: string;
  practicalUsage: string;
  month: number;
  topics: string[];
  status: ModuleStatus;
  skills: string[];
  resources: Resource[];
  previewImage: string;
  dailySchedule: DailyTask[];
  masteryProject: {
    title: string;
    description: string;
  };
}

export interface ProjectTask {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'System Design' | 'Security';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}
