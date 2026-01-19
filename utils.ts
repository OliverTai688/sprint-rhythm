
import { Sprint, LifeTrack } from './types';

/**
 * Generate a sequence of sprints based on a starting date and count
 */
export const generateSprints = (startDate: Date, count: number): Sprint[] => {
  const sprints: Sprint[] = [];
  let currentStart = new Date(startDate);

  for (let i = 0; i < count; i++) {
    const start = new Date(currentStart);
    const end = new Date(currentStart);
    end.setDate(end.getDate() + 27); // 4 weeks = 28 days (0-27)

    // Assign tracks cyclically for mock data
    const tracks = [LifeTrack.GROWTH, LifeTrack.STABILITY, LifeTrack.RECOVERY];
    const lifeTrack = tracks[i % 3]; // 使預設分布更均勻

    sprints.push({
      id: `sprint-${i + 1}`,
      title: `Sprint ${i + 1}`,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      lifeTrack,
      description: `這是第 ${i + 1} 個週期的深度實踐。專注於 ${lifeTrack === LifeTrack.GROWTH ? '自我突破與新技能獲取' : lifeTrack === LifeTrack.STABILITY ? '日常流程的穩固與優化' : '身心的重啟與能量修復'}。`,
      materials: [
        { 
          id: 'default-drive', 
          label: 'Materials', 
          url: 'https://drive.google.com/drive/folders/1eZ6grD-bKoQxP8CS0dN9O92jCbE8DEnn?usp=sharing' 
        }
      ],
      weeklyReviews: [false, false, false, false]
    });

    currentStart.setDate(currentStart.getDate() + 28);
  }
  return sprints;
};

export const getSprintStatus = (sprint: Sprint, today: Date = new Date()) => {
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  
  // 設置時間為當天 00:00:00 以進行精確日期比較
  const compareToday = new Date(today);
  compareToday.setHours(0, 0, 0, 0);
  
  const compareStart = new Date(start);
  compareStart.setHours(0, 0, 0, 0);
  
  const compareEnd = new Date(end);
  compareEnd.setHours(23, 59, 59, 999);
  
  if (compareToday < compareStart) return 'future';
  if (compareToday > compareEnd) return 'past';
  return 'current';
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getSprintDateRange = (sprint: Sprint) => {
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} — ${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`;
};
