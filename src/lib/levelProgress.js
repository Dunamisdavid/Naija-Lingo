export function getCurrentUnitProgress(units, completedLessonIds) {
  if (!units || units.length === 0) {
    return { level: 1, unit: null, completed: 0, total: 0, allComplete: false };
  }

  const currentUnitIndex = units.findIndex(
    (u) => u.lessons.length > 0 && !u.lessons.every((l) => completedLessonIds.has(l.id))
  );

  if (currentUnitIndex === -1) {
    // Every unit with content has been fully completed
    const lastUnit = units[units.length - 1];
    return { level: units.length, unit: lastUnit, completed: lastUnit.lessons.length, total: lastUnit.lessons.length, allComplete: true };
  }

  const unit = units[currentUnitIndex];
  const completed = unit.lessons.filter((l) => completedLessonIds.has(l.id)).length;

  return { level: currentUnitIndex + 1, unit, completed, total: unit.lessons.length, allComplete: false };
}