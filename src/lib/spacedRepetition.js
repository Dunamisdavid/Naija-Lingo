export function computeNextReview(score) {
  const now = new Date();
  let days;

  if (score === null || score === undefined) {
    days = 3;
  } else if (score < 60) {
    days = 1;
  } else if (score < 85) {
    days = 3;
  } else {
    days = 7;
  }

  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

// Used by Learn: new material first, then whatever's most overdue for review.
export function pickNextLesson(lessons, progressList) {
  if (!lessons || lessons.length === 0) return null;

  const progressByLesson = new Map(progressList.map((p) => [p.lessonId, p]));
  const now = new Date();

  const unattempted = lessons.filter((l) => !progressByLesson.has(l.id));
  if (unattempted.length > 0) {
    return unattempted[0];
  }

  const due = lessons
    .map((l) => ({ lesson: l, progress: progressByLesson.get(l.id) }))
    .filter(({ progress }) => new Date(progress.nextReviewAt) <= now)
    .sort((a, b) => new Date(a.progress.nextReviewAt) - new Date(b.progress.nextReviewAt));

  if (due.length > 0) {
    return due[0].lesson;
  }

  return lessons[0];
}

// Used by Speak: review-only. Only serves lessons the learner has already
// attempted in Learn, prioritizing whichever is most overdue. Never
// introduces brand-new material — that's Learn's job now.
export function pickReviewLesson(lessons, progressList) {
  if (!lessons || lessons.length === 0) return null;

  const progressByLesson = new Map(progressList.map((p) => [p.lessonId, p]));
  const now = new Date();

  const attempted = lessons
    .map((l) => ({ lesson: l, progress: progressByLesson.get(l.id) }))
    .filter(({ progress }) => progress);

  if (attempted.length === 0) return null;

  const due = attempted
    .filter(({ progress }) => new Date(progress.nextReviewAt) <= now)
    .sort((a, b) => new Date(a.progress.nextReviewAt) - new Date(b.progress.nextReviewAt));

  if (due.length > 0) return due[0].lesson;

  const oldest = [...attempted].sort(
    (a, b) => new Date(a.progress.completedAt) - new Date(b.progress.completedAt)
  );
  return oldest[0].lesson;
}