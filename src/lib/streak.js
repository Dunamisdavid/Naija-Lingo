export function computeStreak(progressList) {
  if (!progressList || progressList.length === 0) return 0;

  const dayStrings = [...new Set(
    progressList.map((p) => new Date(p.completedAt).toDateString())
  )];

  const dayTimes = dayStrings
    .map((d) => new Date(d).getTime())
    .sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - oneDay;

  if (dayTimes[0] !== today && dayTimes[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dayTimes.length - 1; i++) {
    if (dayTimes[i] - dayTimes[i + 1] === oneDay) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}