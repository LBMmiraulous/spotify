
export interface Task {
  id: string;
  title: string;
  duration: string;
  priority: '高' | '中' | '低';
  completed: boolean;
  time: string;
}

export interface DailyPlan {
  date: string;
  focus: string;
  tasks: Task[];
  motivation: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  lyrics: { time: number; text: string }[];
  duration: number; // in seconds
}

export enum DynamicIslandMode {
  PILL = 'PILL',
  EXPANDED = 'EXPANDED',
  LYRICS = 'LYRICS'
}
