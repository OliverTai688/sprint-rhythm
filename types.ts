
export enum LifeTrack {
  STABILITY = 'stability',
  GROWTH = 'growth',
  RECOVERY = 'recovery'
}

export enum SprintStatus {
  PAST = 'past',
  CURRENT = 'current',
  FUTURE = 'future'
}

export interface Material {
  id: string;
  label: string;
  url: string;
}

export interface Sprint {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  lifeTrack: LifeTrack;
  description?: string;
  materials: Material[];
  weeklyReviews: boolean[]; // Array of 4 booleans representing Week 1 to Week 4
}
